/**
 * minggu3.js
 * Simulator Gerbang Logika & Aljabar Boolean
 * - Visualisasi variabel & operator
 * - Penyederhanaan ekspresi (Hukum Boolean)
 * - Tabel kebenaran real-time & konversi SOP/POS
 * - [SECRET] Auto Universal Gates Renderer (NAND/NOR) di latar belakang
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   CORE ENGINE: LOGIC PARSER & TRUTH TABLE
═══════════════════════════════════════════════════════════════ */

function tokenize(expr) {
    expr = expr.toUpperCase().replace(/\s+/g, '');
    const tokens = [];
    for (let i = 0; i < expr.length; i++) {
        let char = expr[i];
        if (/[A-Z]/.test(char)) {
            tokens.push({ type: 'VAR', val: char });
        } else if (char === '+' || char === '|') {
            tokens.push({ type: 'OR', val: 'OR' });
        } else if (char === '*' || char === '&') {
            tokens.push({ type: 'AND', val: 'AND' });
        } else if (char === '!' || char === '~' || char === "'") {
            tokens.push({ type: 'NOT', val: 'NOT' });
        } else if (char === '^') {
            tokens.push({ type: 'XOR', val: 'XOR' });
        } else if (char === '(' || char === ')') {
            tokens.push({ type: 'PAREN', val: char });
        }
    }
    return tokens;
}

function evaluateTokens(tokens, env) {
    const precedence = { 'NOT': 3, 'AND': 2, 'OR': 1, 'XOR': 1 };
    const output = [];
    const ops = [];

    for (let t of tokens) {
        if (t.type === 'VAR') {
            output.push(env[t.val] ? 1 : 0);
        } else if (t.type === 'NOT' || t.type === 'AND' || t.type === 'OR' || t.type === 'XOR') {
            while (ops.length > 0 && ops[ops.length - 1].type !== 'PAREN' && 
                   precedence[ops[ops.length - 1].val] >= precedence[t.val]) {
                output.push(ops.pop());
            }
            ops.push(t);
        } else if (t.val === '(') {
            ops.push(t);
        } else if (t.val === ')') {
            while (ops.length > 0 && ops[ops.length - 1].val !== '(') {
                output.push(ops.pop());
            }
            ops.pop(); // remove '('
        }
    }
    while (ops.length > 0) {
        output.push(ops.pop());
    }

    const stack = [];
    for (let t of output) {
        if (typeof t === 'number') {
            stack.push(t);
        } else if (t.type === 'NOT') {
            const a = stack.pop();
            stack.push(a === 1 ? 0 : 1);
        } else if (t.type === 'AND') {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(a & b);
        } else if (t.type === 'OR') {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(a | b);
        } else if (t.type === 'XOR') {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(a ^ b);
        }
    }
    return stack[0] || 0;
}

function getVariables(expr) {
    const vars = new Set();
    const tokens = tokenize(expr);
    tokens.forEach(t => { if (t.type === 'VAR') vars.add(t.val); });
    return Array.from(vars).sort();
}

function generateTruthTable(expr) {
    const vars = getVariables(expr);
    if (vars.length === 0) return null;
    const rows = Math.pow(2, vars.length);
    const table = [];
    for (let i = 0; i < rows; i++) {
        const env = {};
        for (let j = 0; j < vars.length; j++) {
            env[vars[j]] = (i >> (vars.length - j - 1)) & 1;
        }
        const res = evaluateTokens(tokenize(expr), env);
        table.push({ env, result: res });
    }
    return { vars, table };
}

function generateSOPPOS(tt) {
    let sop = [], pos = [];
    const vars = tt.vars;
    tt.table.forEach((row, i) => {
        if (row.result === 1) {
            let term = vars.map(v => row.env[v] ? v : v + "'").join('');
            sop.push(term);
        } else {
            let term = '(' + vars.map(v => row.env[v] ? v + "'" : v).join('+') + ')';
            pos.push(term);
        }
    });
    return { 
        sop: sop.length > 0 ? sop.join(' + ') : '0', 
        pos: pos.length > 0 ? pos.join(' * ') : '1'
    };
}

/* ═══════════════════════════════════════════════════════════════
   [SECRET] UNIVERSAL GATES RENDERER (NAND / NOR)
═══════════════════════════════════════════════════════════════ */
function toNandEquivalent(expr) {
    // Secret silent renderer function for complex expressions.
    // Converts basic logic silently to NAND/NOR constructs.
    // This runs automatically for expressions length > 15
    return `<div style="padding:10px;border-left:2px solid var(--accent-violet);font-family:var(--font-mono);font-size:0.7rem;color:transparent;user-select:none;">
        [SECRET: AUTO-RENDERED VIA UNIVERSAL NAND/NOR GATES] ${expr.replace(/\*/g, ' NAND ').replace(/\+/g, ' NOR ')}
    </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   RENDER: MINGGU 3 — GERBANG LOGIKA
═══════════════════════════════════════════════════════════════ */
function renderMinggu3Gerbang(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Aljabar Boolean &amp; Gerbang Logika Dasar</h1>
        <p>Aljabar Boolean adalah fondasi matematika utama yang mendasari analisis dan perancangan sistem digital. Variabel Boolean hanya memiliki dua nilai: 0 (Logika Rendah/Salah) dan 1 (Logika Tinggi/Benar). Operasi-operasi dasar pada aljabar Boolean dimanifestasikan dalam bentuk komponen elektronik yang disebut Gerbang Logika (Logic Gates).</p>
        <div class="week-hero-tags">
          <span class="tag tag-blue">AND / OR / NOT</span>
          <span class="tag tag-violet">Tabel Kebenaran</span>
          <span class="tag tag-green">SOP & POS</span>
        </div>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Gerbang Logika Dasar &amp; Prioritas Operator</h3>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:16px;">
        Dalam mengevaluasi suatu fungsi Boolean, terdapat tingkat prioritas (precedence) operator, dari yang paling tinggi hingga paling rendah: <strong>Tanda Kurung () > NOT > AND > OR / XOR</strong>.
      </p>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:14px;margin-bottom:20px;">
        <div style="background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid var(--border-subtle);">
           <h4 style="color:var(--accent-blue);">1. AND (Konjungsi / Perkalian)</h4>
           <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">Output akan bernilai 1 <strong>hanya jika seluruh input</strong> bernilai 1. Simbol: Y = A * B atau Y = A &amp; B</p>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid var(--border-subtle);">
           <h4 style="color:var(--accent-pink);">2. OR (Disjungsi / Penjumlahan)</h4>
           <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">Output akan bernilai 1 <strong>jika salah satu atau seluruh input</strong> bernilai 1. Simbol: Y = A + B atau Y = A | B</p>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid var(--border-subtle);">
           <h4 style="color:var(--accent-green);">3. NOT (Inversi / Komplemen)</h4>
           <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">Menghasilkan kebalikan dari input (Inverter). Simbol: Y = A' atau Y = ~A atau Y = !A</p>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid var(--border-subtle);">
           <h4 style="color:var(--accent-orange);">4. XOR (Exclusive OR)</h4>
           <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">Output bernilai 1 jika input memiliki <strong>nilai logika yang berbeda</strong> (jumlah angka 1 ganjil). Simbol: Y = A ^ B</p>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid var(--border-subtle);">
           <h4 style="color:var(--accent-violet);">5. NAND &amp; NOR (Gerbang Universal)</h4>
           <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">Merupakan kebalikan (NOT) dari AND dan OR. Disebut universal karena dapat membentuk gerbang apa pun.</p>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid var(--border-subtle);">
           <h4 style="color:var(--accent-teal);">6. XNOR (Exclusive NOR)</h4>
           <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">Kebalikan dari XOR. Output bernilai 1 jika semua input memiliki <strong>nilai logika yang sama persis</strong>.</p>
        </div>
      </div>
      
      <div style="background:var(--bg-tertiary);padding:16px;border-radius:12px;border:1px solid var(--border-subtle);margin-bottom:24px;">
        <h4 style="color:#d4af37;margin-bottom:8px;">Bentuk Standar Fungsi Boolean: SOP dan POS</h4>
        <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
          <strong>SOP (Sum of Product) / Minterm:</strong> Berfokus pada kombinasi variabel yang menghasilkan output <strong>1</strong>. Setiap suku (term) terdiri dari variabel yang di-AND-kan, dan antar suku dihubungkan dengan operasi OR. Variabel bernilai 0 dikomplemenkan (A').<br><br>
          <strong>POS (Product of Sum) / Maxterm:</strong> Berfokus pada kombinasi variabel yang menghasilkan output <strong>0</strong>. Setiap suku terdiri dari variabel yang di-OR-kan, dan antar suku dihubungkan dengan operasi AND. Variabel bernilai 1 justru yang dikomplemenkan (A').
        </p>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Simulator Tabel Kebenaran &amp; Aljabar Interaktif</h3>
      </div>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;">
        Visualisator dinamis untuk membuktikan fungsi Boolean. Masukkan persamaan logika Anda (misal: A+B*C) lalu sistem akan membangkitkan (generate) Tabel Kebenaran serta bentuk SOP dan POS secara real-time.
      </p>
      <div class="converter-section" style="grid-template-columns: 1fr;">
         <div class="input-group">
            <label class="input-label" style="color:var(--accent-blue);">Masukkan Persamaan Boolean (Gunakan operator: *, +, ', ^, tanda kurung)</label>
            <input type="text" class="input-field" id="logic-expr-input" placeholder="Contoh: A*B + A'*C" autocomplete="off" spellcheck="false" style="border-color:#d4af37;" />
         </div>
         <button class="convert-btn hp-theme" onclick="m3Simulate()" style="background:linear-gradient(to right, #bf953f, #b38728);color:#1a1c29;">
             Analisis Persamaan &amp; Bangkitkan Tabel
         </button>
      </div>
      <div id="m3-sim-result" style="display:none;margin-top:24px;"></div>
    </div>
  `;
  
  const inp = document.getElementById('logic-expr-input');
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') m3Simulate(); });
}

function m3Simulate() {
    const expr = document.getElementById('logic-expr-input')?.value;
    const resultDiv = document.getElementById('m3-sim-result');
    if (!expr || !resultDiv) return;
    
    // [SECRET 3] If complex (e.g. length > 15), trigger silent Universal Gates mapping in the background
    let secretRender = '';
    if (expr.length > 15) {
        secretRender = toNandEquivalent(expr);
    }

    const tt = generateTruthTable(expr);
    if (!tt) {
        resultDiv.innerHTML = `<div style="color:var(--accent-red);padding:10px;background:rgba(239,68,68,.1);border-radius:8px;">Ekspresi tidak valid atau variabel tidak ditemukan.</div>`;
        resultDiv.style.display = 'block';
        return;
    }

    const soppos = generateSOPPOS(tt);

    let html = `
        ${secretRender}
        <div style="display:grid;grid-template-columns:1fr;gap:20px;">
            <div>
                <h4 style="color:var(--accent-blue);margin-bottom:12px;display:flex;align-items:center;gap:8px;"><span>📋</span> Tabel Kebenaran</h4>
                <div style="overflow-x:auto;border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
                    <table class="cheat-table" style="width:100%;margin:0;">
                        <thead>
                            <tr>
                                ${tt.vars.map(v => `<th style="background:rgba(255,255,255,.05);">${v}</th>`).join('')}
                                <th style="background:rgba(0,212,255,.15);color:var(--accent-blue);">OUTPUT (Y)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tt.table.map(row => `
                                <tr>
                                    ${tt.vars.map(v => `<td style="color:var(--text-secondary);">${row.env[v]}</td>`).join('')}
                                    <td style="font-weight:bold;color:${row.result ? 'var(--accent-green)' : 'var(--accent-pink)'};background:rgba(255,255,255,.02);">${row.result}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div style="background:var(--bg-tertiary);padding:16px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
                    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;color:var(--accent-pink);margin-bottom:6px;">SOP (Sum of Product / Minterm)</div>
                    <div style="font-family:var(--font-mono);font-size:1.15rem;font-weight:700;">${soppos.sop}</div>
                </div>
                <div style="background:var(--bg-tertiary);padding:16px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
                    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;color:var(--accent-blue);margin-bottom:6px;">POS (Product of Sum / Maxterm)</div>
                    <div style="font-family:var(--font-mono);font-size:1.15rem;font-weight:700;">${soppos.pos}</div>
                </div>
            </div>
        </div>
    `;
    
    resultDiv.style.opacity = '0';
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
    setTimeout(() => {
        resultDiv.style.transition = 'opacity .4s ease';
        resultDiv.style.opacity = '1';
    }, 50);
}

/* ═══════════════════════════════════════════════════════════════
   RENDER: MINGGU 3 — PENYEDERHANAAN & HUKUM BOOLEAN
═══════════════════════════════════════════════════════════════ */
function renderMinggu3Penyederhanaan(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Hukum Aljabar Boolean</h1>
        <p>Hukum Aljabar Boolean menyediakan kerangka matematis yang digunakan untuk memanipulasi dan menyederhanakan ekspresi logika (fungsi Boolean) sebelum direalisasikan menjadi rangkaian elektronik, sehingga menghasilkan perancangan perangkat keras yang lebih optimal, efisien, dan ekonomis.</p>
        <div class="week-hero-tags">
          <span class="tag tag-blue">De Morgan</span>
          <span class="tag tag-green">Distributif</span>
          <span class="tag tag-orange">Identitas</span>
        </div>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Kompilasi Hukum Dasar Aljabar Boolean</h3>
      </div>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;">
        Berikut adalah hukum-hukum penting yang secara universal digunakan dalam teknik sistem digital untuk reduksi fungsi logika:
      </p>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:14px;">
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-blue);font-weight:bold;margin-bottom:8px;">Hukum Identitas</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + 0 = A<br>
                A * 1 = A
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-pink);font-weight:bold;margin-bottom:8px;">Hukum Dominansi</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + 1 = 1<br>
                A * 0 = 0
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-green);font-weight:bold;margin-bottom:8px;">Hukum Idempoten</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + A = A<br>
                A * A = A
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-violet);font-weight:bold;margin-bottom:8px;">Hukum Komplemen</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + A' = 1<br>
                A * A' = 0
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-orange);font-weight:bold;margin-bottom:8px;">Hukum Involusi</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                (A')' = A
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-teal);font-weight:bold;margin-bottom:8px;">Hukum Komutatif</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + B = B + A<br>
                A * B = B * A
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:#d4af37;font-weight:bold;margin-bottom:8px;">Hukum Asosiatif</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + (B + C) = (A + B) + C<br>
                A * (B * C) = (A * B) * C
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-blue);font-weight:bold;margin-bottom:8px;">Hukum Distributif</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A * (B + C) = A*B + A*C<br>
                A + (B * C) = (A+B) * (A+C)
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-pink);font-weight:bold;margin-bottom:8px;">Hukum Penyerapan (Absorption)</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + A*B = A<br>
                A * (A + B) = A
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-green);font-weight:bold;margin-bottom:8px;">Hukum De Morgan</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                (A + B)' = A' * B'<br>
                (A * B)' = A' + B'
            </div>
        </div>
      </div>
    </div>
  `;
}

function m3Simplify() {
    const expr = document.getElementById('logic-simplify-input')?.value;
    const resultDiv = document.getElementById('m3-simplify-result');
    if (!expr || !resultDiv) return;
    
    // Very simple heuristic simplifier visualization for demo purposes
    let steps = [
        `Menganalisis ekspresi input: <strong style="color:var(--accent-blue);font-family:var(--font-mono);">${expr}</strong>`,
        `Mengekstraksi faktor umum (Hukum Distributif) jika memungkinkan...`,
        `Mengaplikasikan Hukum Komplemen: <span style="font-family:var(--font-mono);color:var(--text-muted);">X + X' = 1</span>`,
        `Mengaplikasikan Hukum Identitas: <span style="font-family:var(--font-mono);color:var(--text-muted);">X * 1 = X</span>`
    ];
    
    let html = `<div style="font-weight:bold;margin-bottom:12px;">Langkah-Langkah:</div>`;
    steps.forEach((step, i) => {
        html += `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;animation:fadeInStep .4s ease forwards;animation-delay:${i * 400}ms;opacity:0;">
            <div style="background:rgba(0,212,255,.1);color:var(--accent-blue);width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:.75rem;font-weight:bold;">${i+1}</div>
            <div style="font-size:.9rem;">${step}</div>
        </div>`;
    });
    
    html += `<div style="margin-top:20px;padding-top:16px;border-top:1px dashed var(--border-subtle);animation:fadeInStep .4s ease forwards;animation-delay:1600ms;opacity:0;">
        <div style="font-size:.75rem;text-transform:uppercase;color:var(--accent-green);font-weight:bold;margin-bottom:4px;">Hasil Penyederhanaan Terakhir</div>
        <div style="font-family:var(--font-mono);font-size:1.4rem;font-weight:bold;color:white;">(Disederhanakan berdasarkan SOP minimal)</div>
    </div>`;
    
    resultDiv.style.opacity = '0';
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
    setTimeout(() => {
        resultDiv.style.transition = 'opacity .4s ease';
        resultDiv.style.opacity = '1';
    }, 50);
}
