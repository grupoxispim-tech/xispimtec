// SCRIPT INTERATIVO

// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        hamburger.classList.toggle('active');
    });
}

// Fechar menu ao clicar em um link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) {
            navMenu.style.display = 'none';
        }
        if (hamburger) {
            hamburger.classList.remove('active');
        }
    });
});

// Efeito scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animar elementos ao scrollar
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos da galeria
document.querySelectorAll('.galeria-item').forEach(item => {
    observer.observe(item);
});

// Efeito de digitação no hero
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Adicionar contador de visitas (opcional)
function initVisitCounter() {
    let visitCount = localStorage.getItem('visitCount');
    visitCount = visitCount ? parseInt(visitCount) + 1 : 1;
    localStorage.setItem('visitCount', visitCount);
}

initVisitCounter();

// Lightbox para galeria (ao clicar na imagem)
document.querySelectorAll('.galeria-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const src = img.src;
        showLightbox(src);
    });
});

function showLightbox(src) {
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 10px;
    `;
    
    lightbox.appendChild(img);
    document.body.appendChild(lightbox);
    
    lightbox.addEventListener('click', () => {
        lightbox.remove();
    });
}

// Validação de formulário (se adicionar formulário de contato)
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    return isValid;
}

// Avaliacoes com preview e persistencia permanente no Supabase
const avaliacaoForm = document.querySelector('#avaliacao-form');
const avaliacaoFotoInput = document.querySelector('#avaliacao-foto');
const avaliacaoVideoInput = document.querySelector('#avaliacao-video');
const previewFoto = document.querySelector('#preview-foto');
const previewVideo = document.querySelector('#preview-video');
const previewFotoPlaceholder = document.querySelector('#preview-foto-placeholder');
const previewVideoPlaceholder = document.querySelector('#preview-video-placeholder');
const avaliacaoStatus = document.querySelector('#avaliacao-status');
const avaliacoesLista = document.querySelector('#avaliacoes-lista');
let supabaseClient = null;
let canalTempoReal = null;

function supabaseEstaConfigurado() {
    const cfg = window.OLICAR_SUPABASE_CONFIG;
    if (!cfg) {
        return false;
    }

    const obrigatorios = ['url', 'anonKey'];
    return obrigatorios.every((campo) => typeof cfg[campo] === 'string' && cfg[campo].trim() !== '');
}

function inicializarSupabase() {
    if (!window.supabase || !supabaseEstaConfigurado()) {
        return;
    }

    supabaseClient = window.supabase.createClient(
        window.OLICAR_SUPABASE_CONFIG.url,
        window.OLICAR_SUPABASE_CONFIG.anonKey
    );
}

function estrelasPorNota(nota) {
    return '★'.repeat(nota) + '☆'.repeat(5 - nota);
}

function renderizarAvaliacoes(avaliacoes) {
    if (!avaliacoesLista) {
        return;
    }

    avaliacoesLista.innerHTML = '';

    if (!avaliacoes.length) {
        avaliacoesLista.innerHTML = '<p class="avaliacoes-vazia">Ainda nao ha avaliacoes publicadas.</p>';
        return;
    }

    avaliacoes.forEach((avaliacao) => {
        const item = document.createElement('article');
        item.className = 'avaliacao-item';

        const topo = document.createElement('div');
        topo.className = 'avaliacao-item-topo';

        const nome = document.createElement('strong');
        nome.textContent = avaliacao.nome;

        const nota = document.createElement('span');
        nota.className = 'avaliacao-nota';
        nota.textContent = estrelasPorNota(avaliacao.nota);

        topo.appendChild(nome);
        topo.appendChild(nota);

        const comentario = document.createElement('p');
        comentario.textContent = avaliacao.comentario;

        item.appendChild(topo);
        item.appendChild(comentario);

        const fotoSrc = avaliacao.fotoUrl;
        if (fotoSrc) {
            const foto = document.createElement('img');
            foto.className = 'avaliacao-midia';
            foto.src = fotoSrc;
            foto.alt = `Foto da avaliacao de ${avaliacao.nome}`;
            item.appendChild(foto);
        }

        const videoSrc = avaliacao.videoUrl;
        if (videoSrc) {
            const video = document.createElement('video');
            video.className = 'avaliacao-midia';
            video.src = videoSrc;
            video.controls = true;
            item.appendChild(video);
        }

        avaliacoesLista.appendChild(item);
    });
}

async function renderizarAvaliacoesIniciais() {
    if (!supabaseClient) {
        renderizarAvaliacoes([]);
        if (avaliacaoStatus) {
            avaliacaoStatus.textContent = 'Para salvar para sempre, preencha o supabase-config.js com seu projeto Supabase.';
        }
        return;
    }

    try {
        const remotas = await carregarAvaliacoesSupabase();
        renderizarAvaliacoes(remotas);
        if (avaliacaoStatus) {
            avaliacaoStatus.textContent = 'Modo online ativo. Avaliacoes salvas na nuvem.';
        }
    } catch (erro) {
        renderizarAvaliacoes([]);
        if (avaliacaoStatus) {
            avaliacaoStatus.textContent = 'Nao foi possivel carregar as avaliacoes na nuvem agora.';
        }
    }
}

async function carregarAvaliacoesSupabase() {
    if (!supabaseClient) {
        return [];
    }

    const { data, error } = await supabaseClient
        .from('avaliacoes')
        .select('nome, nota, comentario, foto_url, video_url, criado_em_ms')
        .order('criado_em_ms', { ascending: false })
        .limit(20);

    if (error) {
        throw error;
    }

    return (data || []).map((linha) => ({
        nome: linha.nome || 'Cliente',
        nota: Number(linha.nota || 0),
        comentario: linha.comentario || '',
        fotoUrl: linha.foto_url || '',
        videoUrl: linha.video_url || '',
        criadoEmMs: Number(linha.criado_em_ms || 0)
    }));
}

function iniciarListenerAvaliacoesTempoReal() {
    if (!supabaseClient) {
        return;
    }

    if (canalTempoReal) {
        supabaseClient.removeChannel(canalTempoReal);
        canalTempoReal = null;
    }

    canalTempoReal = supabaseClient
        .channel('avaliacoes-tempo-real')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'avaliacoes' },
            async () => {
                try {
                    const remotas = await carregarAvaliacoesSupabase();
                    renderizarAvaliacoes(remotas);
                    if (avaliacaoStatus) {
                        avaliacaoStatus.textContent = 'Modo online ativo. Avaliacoes em tempo real.';
                    }
                } catch (error) {
                    if (avaliacaoStatus) {
                        avaliacaoStatus.textContent = 'Nao foi possivel atualizar as avaliacoes em tempo real.';
                    }
                }
            }
        )
        .subscribe();
}

async function uploadMidiaSupabase(arquivo, tipo) {
    if (!arquivo || !supabaseClient) {
        return '';
    }

    const nomeSeguro = arquivo.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const caminho = `${tipo}/${Date.now()}-${Math.random().toString(36).slice(2)}-${nomeSeguro}`;

    const { error } = await supabaseClient
        .storage
        .from('avaliacoes-midia')
        .upload(caminho, arquivo, { upsert: false });

    if (error) {
        throw error;
    }

    const { data } = supabaseClient
        .storage
        .from('avaliacoes-midia')
        .getPublicUrl(caminho);

    return data && data.publicUrl ? data.publicUrl : '';
}

function atualizarPreviewArquivo(input, elementoMidia, elementoPlaceholder, tipo) {
    if (!input || !elementoMidia || !elementoPlaceholder) {
        return;
    }

    const arquivo = input.files && input.files[0];
    const urlAnterior = elementoMidia.dataset.objectUrl;

    if (urlAnterior) {
        URL.revokeObjectURL(urlAnterior);
        delete elementoMidia.dataset.objectUrl;
    }

    if (!arquivo) {
        elementoMidia.classList.add('preview-hidden');
        elementoPlaceholder.style.display = 'block';
        if (tipo === 'video') {
            elementoMidia.removeAttribute('src');
            elementoMidia.load();
        }
        return;
    }

    const novaUrl = URL.createObjectURL(arquivo);
    elementoMidia.src = novaUrl;
    elementoMidia.dataset.objectUrl = novaUrl;
    elementoMidia.classList.remove('preview-hidden');
    elementoPlaceholder.style.display = 'none';
}

if (avaliacaoFotoInput) {
    avaliacaoFotoInput.addEventListener('change', () => {
        atualizarPreviewArquivo(avaliacaoFotoInput, previewFoto, previewFotoPlaceholder, 'foto');
    });
}

if (avaliacaoVideoInput) {
    avaliacaoVideoInput.addEventListener('change', () => {
        atualizarPreviewArquivo(avaliacaoVideoInput, previewVideo, previewVideoPlaceholder, 'video');
    });
}

if (avaliacaoForm) {
    avaliacaoForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nomeInput = document.querySelector('#avaliacao-nome');
        const notaInput = document.querySelector('#avaliacao-nota');
        const comentarioInput = document.querySelector('#avaliacao-comentario');

        const nome = nomeInput ? nomeInput.value.trim() : '';
        const nota = notaInput ? Number(notaInput.value) : 0;
        const comentario = comentarioInput ? comentarioInput.value.trim() : '';

        if (!nome || !nota || !comentario) {
            if (avaliacaoStatus) {
                avaliacaoStatus.textContent = 'Preencha nome, nota e comentario para enviar.';
            }
            return;
        }

        const fotoArquivo = avaliacaoFotoInput && avaliacaoFotoInput.files ? avaliacaoFotoInput.files[0] : null;
        const videoArquivo = avaliacaoVideoInput && avaliacaoVideoInput.files ? avaliacaoVideoInput.files[0] : null;

        if (avaliacaoStatus) {
            avaliacaoStatus.textContent = 'Enviando avaliacao...';
        }

        try {
            if (!supabaseClient) {
                if (avaliacaoStatus) {
                    avaliacaoStatus.textContent = 'Configure o Supabase para salvar comentarios para sempre.';
                }
                return;
            }

            const fotoUrl = await uploadMidiaSupabase(fotoArquivo, 'fotos');
            const videoUrl = await uploadMidiaSupabase(videoArquivo, 'videos');
            const payload = {
                nome,
                nota,
                comentario,
                foto_url: fotoUrl,
                video_url: videoUrl,
                criado_em_ms: Date.now()
            };

            const { error } = await supabaseClient.from('avaliacoes').insert(payload);
            if (error) {
                throw error;
            }

            if (avaliacaoStatus) {
                avaliacaoStatus.textContent = 'Avaliacao enviada com sucesso. Obrigado pelo feedback!';
            }
        } catch (erro) {
            if (avaliacaoStatus) {
                avaliacaoStatus.textContent = 'Nao foi possivel enviar agora. Verifique o Supabase e tente novamente.';
            }
        }

        avaliacaoForm.reset();
        atualizarPreviewArquivo(avaliacaoFotoInput, previewFoto, previewFotoPlaceholder, 'foto');
        atualizarPreviewArquivo(avaliacaoVideoInput, previewVideo, previewVideoPlaceholder, 'video');
    });
}

inicializarSupabase();
renderizarAvaliacoesIniciais();
iniciarListenerAvaliacoesTempoReal();

// Ativar navegação ativa
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Console message
console.log('🚗 Bem-vindo ao site OLICAR! Site desenvolvido com ❤️');

// Inicializar tooltips (opcional)
function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.textContent = this.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 0.8rem;
                white-space: nowrap;
                z-index: 1001;
            `;
            document.body.appendChild(tooltip);
            
            this.addEventListener('mouseleave', () => {
                tooltip.remove();
            });
        });
    });
}

initTooltips();
