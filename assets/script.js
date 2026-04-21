const methodData = {
  source: {
    label: 'Step 1',
    title: '代表性源场景构建',
    body: '根据场景统计特征、几何传播特征与潜在表征线索组织源场景，目标是在有限 source budget 下保留跨场景覆盖能力，减少冗余源数据带来的训练成本。',
    tags: ['source budget', 'scenario descriptor', 'cross-scenario coverage']
  },
  pretrain: {
    label: 'Step 2',
    title: 'CSI/CIR 双视图预训练',
    body: '把频域 CSI 与时域 CIR 作为同一传播过程的两个视角，通过重构与对齐学习更稳定的信道表征，为目标场景少样本适配提供共享表征基础。',
    tags: ['CSI', 'CIR', 'dual-view pre-training']
  },
  adapter: {
    label: 'Step 3',
    title: '支持样本驱动的类比适配',
    body: '目标场景只有少量标注样本时，模型显式利用 support-query 之间的局部关系，而不是只做直接迁移或普通 fine-tuning。实验显示 adapter 是最关键的性能来源。',
    tags: ['support bank', 'local relation', 'analogical adaptation']
  },
  strategy: {
    label: 'Step 4',
    title: '轻量策略优化',
    body: '在部署阶段自动选择 support 构造、适配配置与轻量调参策略，减少人工调参成本。该模块带来稳定小增益，适合作为系统闭环补强。',
    tags: ['strategy search', 'deployment cost', 'few-shot tuning']
  }
};

const modalData = {
  pkg1: ['Package 1', '真实 cross-scenario few-shot 协议', '把实验从单场景 target-region split 扩展到多场景 source-to-target 协议。它是标题中 cross-scenario 成立的基础证据，也用于比较 adapter、scratch、no-adapter 等方法。', ['main evidence', 'cross-scenario', 'few-shot protocol']],
  pkg2: ['Package 2', '代表性源场景构建', 'full-clean rerun 获得 192/192 个有效结果。不同源选择策略差异温和，但 proposed 在 64-shot 下平均最优，说明该模块稳定、合理，能补齐代表性 source construction 的实验闭环。', ['192/192 valid', 'source selection', 'moderate gain']],
  pkg3: ['Package 3', '轻量策略优化', 'proposed lightweight tuner 相对 default_fixed 有稳定小幅提升，在 18 个 case 中约 16 个优于 default。它更适合作为部署辅助贡献，而不是主性能卖点。', ['lightweight tuner', '16/18 cases', 'auxiliary contribution']],
  pkg4: ['Package 4', 'Support coverage 主证据', '72/72 runs 完整封板。clustered 持续显著最差，random/diverse/proposed 明显更优；proposed 在 16-shot 最优，64-shot 接近最优。', ['72/72 runs', 'coverage matters', 'main evidence']],
  pkg5: ['Package 5', '16-shot 稳健性强化', 'main 90/90、coverage 60/60 均完成。adapter vs no-adapter 得到 30–0 的配对优势，进一步坐实 adapter 必要性；coverage 部分作为 package4 的补充材料。', ['90/90 main', '60/60 coverage', 'adapter necessity']],
  pkg6: ['Package 6', '论文图表组织', '把表格结果转换为更直观的论文图：CDF of point-wise error、true-vs-pred scatter、spatial error map、coverage metric 图和主表/附表。', ['figures', 'CDF', 'spatial error map']]
};

function showToast(text='已复制') {
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1600);
}

function setMethod(step) {
  const data = methodData[step];
  const detail = document.getElementById('methodDetail');
  detail.innerHTML = `<div><p class="detail-label">${data.label}</p><h3>${data.title}</h3><p>${data.body}</p></div><div class="detail-tags">${data.tags.map(t => `<span>${t}</span>`).join('')}</div>`;
}

document.querySelectorAll('.method-step').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.method-step').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setMethod(btn.dataset.step);
  });
});

document.querySelectorAll('.switch-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.switch-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.body.classList.toggle('deep-mode', btn.dataset.mode === 'deep');
  });
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.result-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add('active');
  });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.package-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.type !== filter);
    });
  });
});

document.querySelectorAll('.package-card').forEach(card => {
  card.addEventListener('click', () => {
    const data = modalData[card.dataset.modal];
    document.getElementById('modalLabel').textContent = data[0];
    document.getElementById('modalTitle').textContent = data[1];
    document.getElementById('modalBody').textContent = data[2];
    document.getElementById('modalTags').innerHTML = data[3].map(t => `<span>${t}</span>`).join('');
    document.getElementById('pkgModal').classList.add('show');
    document.getElementById('pkgModal').setAttribute('aria-hidden', 'false');
  });
});

document.querySelectorAll('[data-close="true"]').forEach(el => {
  el.addEventListener('click', () => {
    document.getElementById('pkgModal').classList.remove('show');
    document.getElementById('pkgModal').setAttribute('aria-hidden', 'true');
  });
});

const pitch = '我研究的是跨场景少样本无线信道建模：通过代表性源场景构建、CSI/CIR 双视图预训练、support-driven analogical adaptation 和轻量策略优化，让模型在新无线场景中只用少量标注样本就能快速适配。实验显示，adapter 类比适配是关键模块，support 样本覆盖与最终适配质量强相关。';
const bib = `@misc{wang2026crossscenario,
  title={Cross-Scenario Few-Shot Wireless Channel Modeling with Analogical Adaptation},
  author={Wang, Jiabei},
  year={2026},
  note={Manuscript in preparation}
}`;

document.getElementById('copyPitch').addEventListener('click', async () => {
  await navigator.clipboard.writeText(pitch);
  showToast('30 秒介绍已复制');
});

document.getElementById('copyCitation').addEventListener('click', async () => {
  await navigator.clipboard.writeText(bib);
  showToast('BibTeX 已复制');
});

const mobileMenu = document.getElementById('mobileMenu');
mobileMenu.addEventListener('click', () => document.getElementById('profilePanel').classList.toggle('open'));
document.querySelectorAll('.side-nav a').forEach(a => a.addEventListener('click', () => document.getElementById('profilePanel').classList.remove('open')));

const progress = document.getElementById('scrollProgress');
const sections = Array.from(document.querySelectorAll('.section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${Math.min(100, (scrollTop / max) * 100)}%`;
  const current = sections.slice().reverse().find(sec => scrollTop + 120 >= sec.offsetTop);
  if (current) {
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current.id}`));
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('pkgModal').classList.remove('show');
    document.getElementById('profilePanel').classList.remove('open');
  }
});
