import { expect, test } from '@playwright/test';

test.describe('smoke', () => {
  test('la portada responde y tiene un único H1', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveTitle(/FINOVA/);
  });

  test('la portada declara idioma y canonical', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://somosfinova.com/',
    );
  });

  test('el simulador responde y se sirve sin JavaScript de React', async ({ page }) => {
    const response = await page.goto('/simulador-hipoteca/');

    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Simulador de hipoteca');
    await expect(page.getByText('Simulador FINOVA — pendiente de implementación')).toBeVisible();

    // El placeholder no se hidrata: sin <astro-island> y sin bundles externos.
    // (El único JS de la página es el menú de la cabecera, inline y sin `src`.)
    await expect(page.locator('astro-island')).toHaveCount(0);
    await expect(page.locator('script[src]')).toHaveCount(0);
  });

  test('las páginas legales van marcadas como noindex', async ({ page }) => {
    await page.goto('/aviso-legal/');

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
  });
});
