"""Convert the HTML pages of one RA of m7-serveis-en-xarxa to MDX for adr1-web.

Usage: python3 -I scripts/convert-ra.py <material dir> src/content RA2
Review the output by hand afterwards: labels, links to RAs without web, ansi.

Follows the conventions of the RA1 conversion: header -> frontmatter, no TOC or
pager, cq-block h2 -> ##, recordatori / bones pràctiques -> Callout, cq-note ->
Callout nota, cq-issues -> ### + **Causa** / **Solució**, quiz -> Quiz/Question,
currículum -> fold, code -> fenced block with title.
"""
import json
import posixpath
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup, Comment, NavigableString, Tag

SRC = Path(sys.argv[1])  # material/
DST = Path(sys.argv[2])  # adr1-web/src/content/
RA = sys.argv[3] if len(sys.argv) > 3 else 'RA2'
WEB_RAS = {'RA1', 'RA2'}  # RAs with a web; links to the rest become plain text
warnings = []


def esc_text(s):
    # MDX: braces and '<' start JSX; markdown specials that appear in prose.
    s = s.replace('\\', '\\\\')
    s = s.replace('{', '\\{').replace('}', '\\}').replace('<', '&lt;')
    s = re.sub(r'(^|\s)\*(\s|$)', r'\1\\*\2', s)
    return s


def code_span(s):
    s = re.sub(r'\s+', ' ', s)
    if '`' in s:
        return f'`` {s} ``'
    return f'`{s}`'


class Page:
    def __init__(self, path):
        self.path = path  # relative to SRC, e.g. RA2/teoria/t2-1.html
        self.url = '/' + str(path.with_suffix('')).lower() + '/'
        self.imports = set()

    def link(self, href):
        if href.startswith(('http://', 'https://', 'mailto:')):
            return href
        if href.startswith('#'):
            return href
        target, _, frag = href.partition('#')
        full = posixpath.normpath(posixpath.join(posixpath.dirname(str(self.path)), target))
        ra = full.split('/')[0]
        if ra not in WEB_RAS:
            return None
        if full.endswith('index.html'):
            web = '/' + posixpath.dirname(full).lower() + '/'
        else:
            web = '/' + full[:-len('.html')].lower() + '/'
        # Like RA1: same RA goes through the RA root (../../guies/g2-1-bind9/),
        # another RA one level further up (../../../ra1/guies/g1-2-kea/).
        own = self.url.split('/')[1]
        here = web.split('/')[1]
        rel = ('../../' if here == own else '../../../' + here + '/') + web.split('/', 2)[2]
        return rel + ('#' + frag if frag else '')

    # ---------- inline ----------
    def inline(self, node):
        out = []
        for c in node.children:
            if isinstance(c, Comment):
                continue
            if isinstance(c, NavigableString):
                out.append(esc_text(re.sub(r'\s+', ' ', str(c))))
                continue
            n = c.name
            cls = c.get('class') or []
            if n in ('strong', 'b'):
                inner = self.inline(c).strip()
                out.append(f'**{inner}**' if inner else '')
            elif n in ('em', 'i'):
                inner = self.inline(c).strip()
                out.append(f'_{inner}_' if inner else '')
            elif n == 'code':
                out.append(code_span(c.get_text()))
            elif n == 'kbd':
                out.append(f'<kbd>{esc_text(c.get_text())}</kbd>')
            elif n == 'a':
                url = self.link(c['href'])
                text = self.inline(c).strip()
                out.append(f'[{text}]({url})' if url else text)
            elif n == 'span' and 'lbl' in cls:
                out.append(f'**{self.inline(c).strip()}**')
            elif n == 'span':
                out.append(self.inline(c))
            elif n == 'br':
                out.append('<br />')
            else:
                warnings.append(f'{self.path}: inline <{n} {cls}>')
                out.append(self.inline(c))
        return ''.join(out)

    def para(self, node):
        return re.sub(r' {2,}', ' ', self.inline(node)).strip()

    # ---------- blocks ----------
    def code(self, div):
        pre = div.find('pre')
        label = pre.get('data-label') or div.find(class_='cq-code-head').span.get_text()
        text = pre.get_text().rstrip('\n')
        # The RA2 HTML still labels commands "Codi"; RA1 calls them "Terminal".
        if label == 'Codi':
            if text.startswith('# This file is managed by'):
                label = '/etc/resolv.conf'
            else:
                label = 'Terminal'
        lang = 'bash' if label.startswith('Terminal') and not pre.find(class_='o') else 'text'
        if pre.find(class_=re.compile('^t-')):
            warnings.append(f'{self.path}: coloured terminal output, check ansi')
        return f'```{lang} title="{label}"\n{text}\n```'

    def table(self, wrap):
        t = wrap.find('table')
        rows = []
        for tr in t.find_all('tr'):
            cells = [self.para(td).replace('|', '\\|') for td in tr.find_all(['th', 'td'])]
            rows.append(cells)
            if tr.find(['ul', 'ol', 'p', 'pre', 'div']):
                warnings.append(f'{self.path}: table cell with block content')
        head = rows[0]
        lines = ['| ' + ' | '.join(head) + ' |', '|' + '---|' * len(head)]
        lines += ['| ' + ' | '.join(r) + ' |' for r in rows[1:]]
        return '\n'.join(lines)

    def lst(self, node):
        ordered = node.name == 'ol'
        items = []
        for i, li in enumerate(node.find_all('li', recursive=False), 1):
            marker = f'{i}. ' if ordered else '- '
            pad = ' ' * len(marker)
            blocks = self.blocks(li) if li.find(['p', 'div', 'ul', 'ol', 'pre', 'dl'], recursive=False) else [self.para(li)]
            body = '\n\n'.join(blocks)
            body = '\n'.join((pad + l if l and k else l) for k, l in enumerate(body.split('\n')))
            items.append(marker + body)
        loose = any('\n' in it for it in items)
        return ('\n\n' if loose else '\n').join(items)

    def issues(self, dl):
        out = []
        for el in dl.find_all(['dt', 'dd'], recursive=False):
            if el.name == 'dt':
                out.append('### ' + self.para(el))
            else:
                bl = self.blocks(el) if el.find(['p', 'div', 'ul', 'ol'], recursive=False) else [self.para(el)]
                out.extend(bl)
        return '\n\n'.join(out)

    def flow(self, div):
        steps = [{'n': s.find(class_='n').get_text(strip=True), 't': s.find(class_='t').get_text(strip=True),
                  'd': re.sub(r'\s+', ' ', s.find(class_='d').get_text()).strip()} for s in div.find_all(class_='dora-step')]
        self.imports.add('Flow')
        return f'<Flow steps={{{json.dumps(steps, ensure_ascii=False)}}} />'

    def question(self, q):
        statement = q.find(class_='statement').decode_contents().strip()
        opts = [[o.decode_contents().strip(), o['data-correct'] == 'true'] for o in q.find_all(class_='cq-option')]
        self.imports.update(['Quiz', 'Question'])
        attrs = (f'id={json.dumps(q["data-id"])} type={json.dumps(q["data-type"])} '
                 f'statement={json.dumps(statement, ensure_ascii=False)} ')
        if q.get('data-explanation'):
            attrs += f'explanation={json.dumps(q["data-explanation"], ensure_ascii=False)} '
        attrs += f'options={{{json.dumps(opts, ensure_ascii=False)}}}'
        return f'  <Question {attrs} />'

    def blocks(self, node):
        out = []
        for c in node.children:
            if isinstance(c, Comment):
                continue
            if isinstance(c, NavigableString):
                if c.strip():
                    out.append(esc_text(c.strip()))
                continue
            n, cls = c.name, c.get('class') or []
            if n == 'h2':
                continue  # handled by the block
            if n == 'h3':
                out.append('### ' + self.para(c))
            elif n == 'p' and 'cq-prerequisites' in cls:
                out.append('### ' + self.para(c).strip('*'))
            elif n == 'p':
                out.append(self.para(c))
            elif n in ('ul', 'ol'):
                out.append(self.lst(c))
            elif n == 'div' and 'cq-code' in cls:
                out.append(self.code(c))
            elif n == 'div' and 'cq-tablewrap' in cls:
                out.append(self.table(c))
            elif n == 'dl' and 'cq-issues' in cls:
                out.append(self.issues(c))
            elif n == 'div' and 'cq-note' in cls:
                self.imports.add('Callout')
                out.append('<Callout kind="nota">\n\n' + self.para(c) + '\n\n</Callout>')
            elif n == 'div' and 'dora-flow' in cls:
                out.append(self.flow(c))
            elif n == 'div' and 'cq-question' in cls:
                out.append(self.question(c))
            else:
                warnings.append(f'{self.path}: block <{n} {cls}>')
                out.append(self.para(c))
        return [b for b in out if b]

    def block(self, div):
        kind = div.get('data-kind')
        h2 = div.find('h2', recursive=False)
        head = '## ' + self.para(h2) if h2 else None
        body = self.blocks(div)
        if kind == 'quiz':
            body = ['<Quiz>\n' + '\n'.join(b for b in body if b.startswith('  <Question')) + '\n</Quiz>']
            extra = [b for b in self.blocks(div) if not b.startswith('  <Question')]
            body = extra + body
        elif kind in ('recordatori', 'bones pràctiques'):
            self.imports.add('Callout')
            body = [f'<Callout kind="{kind}">\n\n' + '\n\n'.join(body) + '\n\n</Callout>']
        elif kind == 'currículum':
            body = ['<details class="fold">\n<summary>Mostra els criteris</summary>\n\n' + '\n\n'.join(body) + '\n\n</details>']
        return '\n\n'.join(([head] if head else []) + body)

    def convert(self):
        soup = BeautifulSoup((SRC / self.path).read_text(), 'html.parser')
        main = soup.find('main')
        header = main.find('header')
        ref = header.find(class_='eyebrow').get_text().split('·')[-1].strip()
        title = header.h1.get_text(strip=True)
        desc = re.sub(r'\s+', ' ', header.find(class_='lede').get_text()).strip()
        header.decompose()
        for sel in ('details.cq-toc', 'nav.cq-pager'):
            for el in main.select(sel):
                el.decompose()
        parts = []
        for c in main.children:
            if isinstance(c, Comment) or (isinstance(c, NavigableString) and not c.strip()):
                continue
            if isinstance(c, Tag) and 'cq-block' in (c.get('class') or []):
                parts.append(self.block(c))
            else:
                warnings.append(f'{self.path}: top-level {getattr(c, "name", repr(c)[:40])}')
        fm = f'---\nref: {ref}\ntitle: {json.dumps(title, ensure_ascii=False)}\ndescription: {json.dumps(desc, ensure_ascii=False)}\n---\n\n'
        order = ['Callout', 'Flow', 'Question', 'Quiz']
        imps = ''.join(f'import {i} from "../../../components/{i}.astro";\n' for i in order if i in self.imports)
        return fm + (imps + '\n' if imps else '') + '\n\n'.join(parts) + '\n'


for f in sorted((SRC / RA).glob('*/*.html')):
    rel = f.relative_to(SRC)
    if rel.parts[1].startswith('_'):
        continue
    page = Page(rel)
    out = DST / RA.lower() / rel.parts[1] / (f.stem + '.mdx')
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page.convert())
    print('wrote', out.relative_to(DST))
for w in warnings:
    print('WARN', w)
