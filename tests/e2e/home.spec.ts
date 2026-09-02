import { expect, test } from '@playwright/test';

/** Contenido y estructura de la portada. No se comprueban píxeles ni colores. */

test.describe('portada', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('tiene un único H1 con el mensaje principal', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 });

    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('No solo conseguimos hipotecas');
    await expect(page).toHaveTitle('Broker hipotecario | FINOVA');
  });

  test('el hero identifica la actividad regulada', async ({ page }) => {
    const hero = page.locator('.hero');

    await expect(hero.getByText('Broker hipotecario', { exact: true })).toBeVisible();
    await expect(hero).toContainText('Intermediario de Crédito Inmobiliario');
    await expect(hero).toContainText('E794');
  });

  test('existen las secciones ancladas desde la cabecera', async ({ page }) => {
    for (const id of ['proceso', 'sobre-finova', 'contacto']) {
      await expect(page.locator(`section#${id}`)).toBeVisible();
    }
  });

  test('el proceso muestra sus cuatro pasos numerados', async ({ page }) => {
    const steps = page.locator('#proceso .process__step');

    await expect(steps).toHaveCount(4);
    await expect(steps.first()).toContainText('01');
    await expect(steps.first()).toContainText('Analizamos tu perfil');
    await expect(steps.last()).toContainText('Te acompañamos hasta la firma');
  });

  test('el bloque institucional aclara que FINOVA no es una entidad financiera', async ({
    page,
  }) => {
    const about = page.locator('section#sobre-finova');

    await expect(about).toContainText('no somos una entidad financiera');
    await expect(about).toContainText('intermediario de crédito inmobiliario');
  });

  test('las cinco especialidades enlazan a su página', async ({ page }) => {
    const items = page.locator('.services__item');
    await expect(items).toHaveCount(5);

    for (const [name, href] of [
      ['Hipotecas para primera y segunda residencia', '/hipotecas-primera-segunda-residencia/'],
      ['Hipotecas para no residentes', '/hipotecas-no-residentes/'],
      ['Reunificación de deudas', '/reunificacion-deudas/'],
      ['Financiación para promotores', '/financiacion-promotores/'],
      ['Hipotecas al 100%', '/hipotecas-100/'],
    ] as const) {
      await expect(page.locator('.services__list').getByRole('link', { name })).toHaveAttribute(
        'href',
        href,
      );
    }
  });

  test('se listan las once entidades financieras', async ({ page }) => {
    const banks = page.locator('.banks__item');

    await expect(banks).toHaveCount(11);
    await expect(banks.filter({ hasText: 'Caja Rural de Asturias' })).toHaveCount(1);
    await expect(banks.filter({ hasText: 'Banco Pichincha' })).toHaveCount(1);
  });

  test('el bloque destacado lleva al simulador', async ({ page }) => {
    await page.locator('.simulator-cta').getByRole('link', { name: 'Simular mi hipoteca' }).click();

    await expect(page).toHaveURL(/\/simulador-hipoteca\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Simulador de hipoteca');
  });

  test('todos los campos del formulario tienen etiqueta real', async ({ page }) => {
    const form = page.locator('.contact__form');

    for (const label of ['Nombre', 'Email', 'Asunto', 'Mensaje']) {
      await expect(form.getByLabel(label, { exact: true })).toBeVisible();
    }
    await expect(form.getByLabel('Teléfono (opcional)')).toBeVisible();

    // Ningún campo usa el placeholder como sustituto de la etiqueta.
    const withPlaceholder = await form.locator('[placeholder]').count();
    expect(withPlaceholder).toBe(0);
  });

  test('el consentimiento enlaza la política de privacidad', async ({ page }) => {
    const consent = page.locator('.consent');

    await expect(consent.getByRole('checkbox')).toHaveAttribute('required', '');
    await expect(consent.getByRole('link', { name: 'Política de Privacidad' })).toHaveAttribute(
      'href',
      '/politica-privacidad/',
    );
  });

  test('el envío está desactivado mientras no haya endpoint', async ({ page }) => {
    await expect(page.locator('.contact__submit')).toBeDisabled();
    await expect(page.locator('.contact__form')).not.toHaveAttribute('action', /.+/);
  });

  test('la portada no carga JavaScript externo ni React', async ({ page }) => {
    await expect(page.locator('script[src]')).toHaveCount(0);
    await expect(page.locator('astro-island')).toHaveCount(0);
  });
});

test.describe('portada en móvil', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('no produce scroll horizontal', async ({ page }) => {
    await page.goto('/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });

  test('los objetivos táctiles principales llegan a 44px', async ({ page }) => {
    await page.goto('/');

    for (const name of ['Estudiar mi hipoteca', 'Simular mi hipoteca']) {
      const box = await page.locator('main').getByRole('link', { name }).first().boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });
});
