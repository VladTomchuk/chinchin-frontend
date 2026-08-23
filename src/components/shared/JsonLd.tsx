/**
 * Один <script type="application/ld+json"> на всі сторінки. Розмітка лишається
 * у script-тезі — це штатний спосіб віддати структуровані дані, тож ховати її
 * стилями не треба й не можна: JSON-LD не дублює видимий текст, а описує його.
 *
 * `<` екрануємо, щоб жоден рядок із перекладів не міг закрити тег script.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
