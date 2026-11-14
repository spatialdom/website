"""Local browser acceptance: pip install playwright; uses installed Chrome."""
from pathlib import Path
from tempfile import TemporaryDirectory
from playwright.sync_api import sync_playwright

ORIGIN = 'http://127.0.0.1:4173'
CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
SHOTS = Path('docs/design/screenshots')
SHOTS.mkdir(parents=True, exist_ok=True)


def check_page(page, width, zoom=False):
    def activate(locator):
        if zoom:
            locator.focus()
            page.keyboard.press('Enter')
        else:
            locator.click()
    failures = []
    page.on('pageerror', lambda error: failures.append(str(error)))
    page.on('response', lambda response: failures.append(f'{response.status}: {response.url}') if response.url.startswith(ORIGIN) and response.status >= 400 else None)
    response = page.goto(ORIGIN + '/design/guidelines/')
    assert response.status == 200
    page.get_by_role('heading', name='Design guidelines', exact=True).wait_for()
    page.evaluate('document.fonts.ready')
    assert page.title() == 'Spatialdom Design Guidelines v1.2.0 | Spatialdom'
    assert page.locator('link[rel=canonical]').get_attribute('href') == 'https://spatialdom.xyz/design/guidelines/'
    assert page.locator('h1').count() == 1
    ids = page.locator('[id]').evaluate_all('(nodes) => nodes.map(n => n.id)')
    assert len(ids) == len(set(ids)), 'duplicate IDs'
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'overflow at {width}'
    if width < 768:
        page.get_by_label('Jump to section').select_option('ai-instructions')
    else:
        activate(page.get_by_role('navigation', name='Guidelines sections').get_by_role('link', name='AI development instructions', exact=True))
    page.wait_for_timeout(500)
    assert page.locator('#ai-instructions').bounding_box()['y'] >= 110, 'anchor hidden by navigation'
    activate(page.get_by_role('button', name='Copy instructions', exact=True))
    page.get_by_role('status').filter(has_text='Instructions copied.').wait_for()
    copied = page.evaluate('navigator.clipboard.readText()')
    assert copied.replace('\r\n', '\n') == Path('docs/design/AGENTS_SNIPPET.md').read_text(encoding='utf-8')
    activate(page.get_by_role('button', name='Validate example', exact=True))
    assert page.locator('#example-project').evaluate('(e) => e === document.activeElement')
    assert page.locator('#example-project').get_attribute('aria-invalid') == 'true'
    page.get_by_label('Project name', exact=True).fill('Synthetic survey')
    activate(page.get_by_role('button', name='Validate example', exact=True))
    assert page.get_by_label('Project name', exact=True).input_value() == 'Synthetic survey'
    page.get_by_role('tab', name='Overview', exact=True).focus()
    page.keyboard.press('ArrowRight')
    assert page.get_by_role('tab', name='Source records', exact=True).get_attribute('aria-selected') == 'true'
    page.keyboard.press('Home')
    assert page.get_by_role('tab', name='Overview', exact=True).get_attribute('aria-selected') == 'true'
    activate(page.get_by_role('button', name='Delete example record', exact=True))
    assert page.get_by_role('dialog').is_visible()
    assert page.get_by_role('button', name='Keep example', exact=True).evaluate('(e) => e === document.activeElement')
    page.keyboard.press('Shift+Tab')
    assert page.locator('dialog').evaluate('(e) => e.contains(document.activeElement)'), 'modal focus escaped'
    page.keyboard.press('Escape')
    assert not page.get_by_role('dialog').is_visible()
    assert page.get_by_role('button', name='Delete example record', exact=True).evaluate('(e) => e === document.activeElement')
    page.keyboard.press('Tab')
    assert page.evaluate("getComputedStyle(document.activeElement).outlineStyle !== 'none'"), 'missing focus'
    for name in ['GUIDELINES.md', 'COMPONENTS.md', 'AGENTS_SNIPPET.md', 'tokens.json']:
        assert page.request.get(ORIGIN + '/design/' + name).status == 200
    page.reload()
    page.get_by_role('heading', name='Design guidelines', exact=True).wait_for()
    assert not failures, failures
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.evaluate("history.replaceState(null, '', '/design/guidelines/'); scrollTo(0,0)")
    page.wait_for_timeout(500)


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME, headless=True)
    for width in [390, 768, 1024, 1440]:
        context = browser.new_context(viewport={'width': width, 'height': 1000}, permissions=['clipboard-read', 'clipboard-write'], reduced_motion='reduce')
        page = context.new_page()
        check_page(page, width)
        if width in [390, 1440]:
            page.screenshot(path=str(SHOTS / f'guidelines-{width}.png'))
            page.locator('#component-reference').evaluate("e => e.scrollIntoView({block: 'start'})")
            page.wait_for_timeout(300)
            page.screenshot(path=str(SHOTS / f'components-{width}.png'))
        print(f'PASS {width}px: layout, anchors, clipboard, validation, keyboard tabs, modal focus/Escape, refresh')
        context.close()
    # Inspect canonical product pages and preserved educational URLs after JS.
    page = browser.new_page()
    for route, expected in [('/sparta/', 'Professional Geodetic Engineering workspace.'), ('/kadastra/', 'Development deferred until after SMACCs'), ('/tax-mapping-system-philippines/', 'Kadastra is coming soon'), ('/rbim-cloud/', 'Spatialdom did not create'), ('/parcel-plotter/', 'Parcel Plotter')]:
        assert page.goto(ORIGIN + route).status == 200
        page.get_by_text(expected, exact=False).first.wait_for()
    browser.close()
    with TemporaryDirectory(ignore_cleanup_errors=True) as profile:
        context = p.chromium.launch_persistent_context(profile, executable_path=CHROME, headless=True, viewport={'width': 1440, 'height': 1000}, permissions=['clipboard-read', 'clipboard-write'], reduced_motion='reduce')
        settings = context.new_page()
        settings.goto('chrome://settings/appearance')
        settings.evaluate('chrome.settingsPrivate.setDefaultZoom(2)')
        page = context.pages[0]
        page.goto(ORIGIN + '/design/guidelines/')
        actual_width = page.evaluate('innerWidth')
        assert 650 <= actual_width <= 730, f'Native 200% zoom not applied: {actual_width}'
        check_page(page, actual_width, zoom=True)
        page.screenshot(path=str(SHOTS / 'guidelines-zoom-200.png'))
        print(f'PASS native Chrome 200% zoom: {actual_width}px CSS viewport; all interactions')
        context.close()
