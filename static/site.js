(function () {
  var C = window.LUXIN || {};
  function money(c) {
    return '£' + (c / 100).toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' GBP';
  }
  function init() {
    // share links should show this page's address
    document.querySelectorAll('.share-button__fallback input.field__input').forEach(function (i) { i.value = location.href.split('?')[0]; });
    var info = document.querySelector('[data-static-product]');
    var vr = document.querySelector('.variant-radios-static');
    var box = document.querySelector('[data-enquiry]');
    if (!info || !vr) return;
    var js = vr.querySelector('script[type="application/json"]');
    if (!js) return;
    var variants = JSON.parse(js.textContent);
    var fieldsets = Array.prototype.slice.call(vr.querySelectorAll('fieldset'));
    var title = (info.querySelector('.product__title h1') || {}).textContent || document.title;
    title = title.trim();

    function selected() {
      return fieldsets.map(function (f) { var c = f.querySelector('input:checked'); return c ? c.value : null; });
    }
    function find(opts) {
      return variants.find(function (v) { return opts.every(function (o, i) { return o === v.options[i]; }); });
    }
    function setPrice(v) {
      var p = info.querySelector('.price'); if (!p || !v) return;
      var sale = v.compare_at_price && v.compare_at_price > v.price;
      p.classList.toggle('price--on-sale', !!sale);
      p.classList.toggle('price--sold-out', !v.available);
      var q = function (s) { return p.querySelector(s); };
      if (q('.price__regular .price-item--regular')) q('.price__regular .price-item--regular').textContent = money(v.price);
      if (q('.price__sale s.price-item--regular')) q('.price__sale s.price-item--regular').textContent = sale ? money(v.compare_at_price) : '';
      if (q('.price-item--sale')) q('.price-item--sale').textContent = money(v.price);
    }
    function setDisabled(opts) {
      fieldsets.forEach(function (f, i) {
        f.querySelectorAll('input').forEach(function (inp) {
          var test = opts.slice(); test[i] = inp.value;
          var v = find(test);
          inp.classList.toggle('disabled', !(v && v.available));
        });
      });
    }
    function setEnquiry(v) {
      if (!box) return;
      var opts = v ? v.title : '';
      var url = location.href.split('#')[0];
      var msg = "Hi " + (C.brand || 'Luxin London') + ", I'm interested in the " + title + (opts ? ' (' + opts + ')' : '') +
        (v ? ' - ' + money(v.price) : '') + '. ' + url;
      var wa = box.querySelector('[data-channel=whatsapp]'), ig = box.querySelector('[data-channel=instagram]'), em = box.querySelector('[data-channel=email]');
      if (C.whatsapp) { wa.href = 'https://wa.me/' + String(C.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent(msg); wa.hidden = false; } else wa.hidden = true;
      if (C.instagram) { ig.href = 'https://ig.me/m/' + C.instagram; ig.hidden = false; } else ig.hidden = true;
      if (C.email) { em.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent('Enquiry: ' + title) + '&body=' + encodeURIComponent(msg); em.hidden = false; } else em.hidden = true;
      var st = box.querySelector('[data-enquiry-stock]');
      if (v && !v.available) { st.textContent = 'This option is currently sold out - message us to ask about restock.'; st.hidden = false; } else st.hidden = true;
    }
    function update(push) {
      var opts = selected(), v = find(opts);
      setPrice(v); setDisabled(opts); setEnquiry(v);
      if (push && v) { try { history.replaceState(null, '', '?variant=' + v.id); } catch (e) {} }
    }
    var want = new URLSearchParams(location.search).get('variant');
    if (want) {
      var wv = variants.find(function (v) { return String(v.id) === want; });
      if (wv) fieldsets.forEach(function (f, i) {
        var r = f.querySelector('input[value="' + wv.options[i].replace(/"/g, '\\"') + '"]'); if (r) r.checked = true;
      });
    }
    vr.addEventListener('change', function () { update(true); });
    update(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
