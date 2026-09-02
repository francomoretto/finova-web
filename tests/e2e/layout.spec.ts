import { expect, test } from '@playwright/test';

/**
 * Sistema visual global: cabecera, navegación y pie.
 * Se comprueba comportamiento, no CSS: nada de comparar colores ni píxeles.
 */

test.describe('cabecera y pie (desktop)', () => {
  test('la portada muestra cabecera y pie con sus puntos de referencia', async ({ page }) => {
    await page.goto('/');

    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    await expect(header.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible();

    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('SOMOS FINOVA, S.L.');
    await expect(footer).toContainText('Simplificamos decisiones complejas.');
    await expect(footer).toContainText(String(new Date().getFullYear()));
  });

  test('el CTA de la cabecera lleva al simulador', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('banner').getByRole('link', { name: 'Estudiar mi hipoteca' }).click();

    await expect(page).toHaveURL(/\/simulador-hipoteca\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Simulador de hipoteca');
  });

  test('la navegación funciona desde una página interior', async ({ page }) => {
    await page.goto('/aviso-legal/');

    await page.getByRole('banner').getByRole('link', { name: 'Simulador', exact: true }).click();

    await expect(page).toHaveURL(/\/simulador-hipoteca\/$/);
  });

  test('los anclas de la portada son absolutos, no relativos a la página actual', async ({
    page,
  }) => {
    await page.goto('/aviso-legal/');

    const proceso = page.getByRole('banner').getByRole('link', { name: 'Proceso' });
    await expect(proceso).toHaveAttribute('href', '/#proceso');
  });

  test('el estado activo sólo se marca en la ruta que corresponde', async ({ page }) => {
    await page.goto('/simulador-hipoteca/');
    const nav = page.getByRole('banner').getByRole('navigation');
    await expect(nav.locator('[aria-current="page"]')).toHaveText('Simulador');

    await page.goto('/aviso-legal/');
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(0);
  });

  test('el pie enlaza las tres páginas legales', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByRole('contentinfo');

    for (const [name, href] of [
      ['Aviso legal', '/aviso-legal/'],
      ['Política de privacidad', '/politica-privacidad/'],
      ['Política de cookies', '/politica-cookies/'],
    ] as const) {
      await expect(footer.getByRole('link', { name })).toHaveAttribute('href', href);
    }

    await expect(footer.getByRole('link', { name: 'info@somosfinova.com' })).toHaveAttribute(
      'href',
      'mailto:info@somosfinova.com',
    );
  });
});

test.describe('menú móvil', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('se abre y se cierra con el botón, y expone su estado', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Abrir menú de navegación' });
    const panel = page.locator('[data-nav-panel]');

    await expect(toggle).toBeVisible();
    await expect(panel).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'site-nav-panel');

    await toggle.click();
    await expect(panel).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar menú de navegación' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await page.getByRole('button', { name: 'Cerrar menú de navegación' }).click();
    await expect(panel).toBeHidden();
  });

  test('Escape lo cierra y devuelve el foco al botón', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Abrir menú de navegación' });
    await toggle.click();
    await expect(page.locator('[data-nav-panel]')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.locator('[data-nav-panel]')).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('se puede navegar al simulador desde el menú', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Abrir menú de navegación' }).click();
    await page.getByRole('banner').getByRole('link', { name: 'Simulador', exact: true }).click();

    await expect(page).toHaveURL(/\/simulador-hipoteca\/$/);
  });

  test('la portada no produce scroll horizontal', async ({ page }) => {
    await page.goto('/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });
});
