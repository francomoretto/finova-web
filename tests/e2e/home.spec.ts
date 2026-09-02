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
    // La web actual numera los pasos con dígitos sueltos dentro de un círculo.
    await expect(steps.first()).toContainText('1');
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

  test('la propuesta de valor es una banda breve, sin los cuatro pilares', async ({ page }) => {
    const value = page.locator('.value');

    await expect(value).toContainText('Comprar tu vivienda puede ser claro, seguro y sin estrés.');

    // La lista de pilares desapareció por completo de esta sección.
    await expect(value.locator('ul')).toHaveCount(0);
    const text = (await value.innerText()).toLowerCase();
    for (const pillar of [
      'negociamos por ti',
      'gestión documental',
      'tasación y seguimiento',
      'acompañamiento hasta la firma',
    ]) {
      expect(text).not.toContain(pillar);
    }
  });

  test('las once entidades se anuncian una sola vez', async ({ page }) => {
    // La primera secuencia es la real; la segunda sólo encadena el bucle.
    const sequences = page.locator('.banks__sequence');
    await expect(sequences).toHaveCount(2);

    const announced = sequences.first().locator('li');
    await expect(announced).toHaveCount(11);
    await expect(announced.filter({ hasText: 'Caja Rural de Asturias' })).toHaveCount(1);
    await expect(announced.filter({ hasText: 'Banco Pichincha' })).toHaveCount(1);

    await expect(sequences.nth(1)).toHaveAttribute('aria-hidden', 'true');
    await expect(sequences.first()).not.toHaveAttribute('aria-hidden', /.*/);
  });

  test('el carrusel tiene un track animado y no desborda la página', async ({ page }) => {
    const track = page.locator('.banks__track');
    await expect(track).toHaveCount(1);

    const info = await page.evaluate(() => {
      const t = document.querySelector('.banks__track');
      const seqs = [...document.querySelectorAll('.banks__sequence')];
      if (!t || seqs.length !== 2) return null;
      const cs = getComputedStyle(t);
      return {
        iterations: cs.animationIterationCount,
        timing: cs.animationTimingFunction,
        viewportOverflow: getComputedStyle(t.parentElement!).overflow,
        // Las dos secuencias deben medir lo mismo: si no, el bucle da un salto.
        equalHalves:
          Math.abs(
            seqs[0]!.getBoundingClientRect().width - seqs[1]!.getBoundingClientRect().width,
          ) < 1,
      };
    });

    expect(info).not.toBeNull();
    expect(info!.iterations).toBe('infinite');
    expect(info!.timing).toBe('linear');
    expect(info!.viewportOverflow).toBe('hidden');
    expect(info!.equalHalves).toBe(true);
  });

  test('el CTA del simulador no va dentro de una tarjeta', async ({ page }) => {
    await expect(page.locator('.simulator-cta__panel')).toHaveCount(0);

    const cta = page.locator('.simulator-cta');
    await expect(
      cta.getByRole('heading', { name: 'Calcula una estimación de tu hipoteca' }),
    ).toBeVisible();
    await expect(cta.getByRole('link', { name: 'Simular mi hipoteca' })).toHaveAttribute(
      'href',
      '/simulador-hipoteca/',
    );
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

  test('el envío está desactivado mientras no haya endpoint, sin aviso técnico visible', async ({
    page,
  }) => {
    await expect(page.locator('.contact__submit')).toBeDisabled();
    await expect(page.locator('.contact__form')).not.toHaveAttribute('action', /.+/);
    await expect(page.getByText('El envío del formulario todavía no está activo')).toHaveCount(0);
  });

  test('protección de datos vive en la columna informativa, no bajo el formulario', async ({
    page,
  }) => {
    const privacy = page.locator('.privacy');
    await expect(privacy).toHaveCount(1);
    await expect(page.locator('.contact__info .privacy')).toHaveCount(1);
    await expect(page.locator('.contact__panel .privacy')).toHaveCount(0);

    await expect(privacy).toContainText('Responsable');
    await expect(privacy).toContainText('SOMOS FINOVA, S.L.');
    await expect(privacy).toContainText('B88977665');
    await expect(privacy).toContainText('Calle Melquiades Álvarez, 26, 1º A, 33003 Oviedo');
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
