// Constantes y configuración
const API_BASE = '/api';
const OUTPUT_ELEMENT = document.getElementById('output');
const TOAST_ELEMENT = document.getElementById('toast');

/**
 * Mostrar notificación toast
 */
function showToast(message, type = 'info', duration = 3000) {
    TOAST_ELEMENT.textContent = message;
    TOAST_ELEMENT.className = `toast show ${type}`;
    
    setTimeout(() => {
        TOAST_ELEMENT.classList.remove('show');
    }, duration);
}

/**
 * Mostrar respuesta formateada en JSON
 */
function displayOutput(data) {
    OUTPUT_ELEMENT.textContent = JSON.stringify(data, null, 2);
}

/**
 * Manejar errores de respuesta
 */
async function handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
        throw {
            status: response.status,
            message: data.message || data.error || 'Error desconocido',
            data
        };
    }
    
    return data;
}

/**
 * Obtener información de la conexión a la BD
 */
async function obtenerInfoDB() {
    try {
        const response = await fetch(`${API_BASE}/db-info`);
        const data = await handleResponse(response);
        
        document.getElementById("DBname").textContent = data.data.dbname;
        document.getElementById("DBname").classList.remove('loading');
        
        document.getElementById("UserName").textContent = data.data.user;
        document.getElementById("UserName").classList.remove('loading');
        
        document.getElementById("status").textContent = '✅ Conectado';
        document.getElementById("status").style.color = '#28a745';
        document.getElementById("status").classList.remove('loading');
        
        showToast('Conexión a la base de datos establecida', 'success');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("status").textContent = '❌ Error de conexión';
        document.getElementById("status").style.color = '#dc3545';
        document.getElementById("status").classList.remove('loading');
        showToast(`Error: ${error.message}`, 'error');
    }
}

/**
 * Crear una nueva cuenta
 */
async function crearRegistro() {
    try {
        const id = document.getElementById('createId').value.trim() || null;
        const balance = document.getElementById('createBalance').value.trim();
        
        if (!balance) {
            showToast('El balance es requerido', 'error');
            return;
        }
        
        const response = await fetch(`${API_BASE}/crear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: id || undefined, 
                balance: parseInt(balance) 
            })
        });
        
        const data = await handleResponse(response);
        displayOutput(data);
        
        document.getElementById('createId').value = '';
        document.getElementById('createBalance').value = '';
        
        showToast('✅ Cuenta creada exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        displayOutput({ error: error.message, status: error.status });
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Obtener todas las cuentas
 */
async function leerRegistros() {
    try {
        const response = await fetch(`${API_BASE}/leer`);
        const data = await handleResponse(response);
        
        displayOutput(data);
        showToast(`✅ ${data.count} cuenta(s) obtenida(s)`, 'success');
    } catch (error) {
        console.error('Error:', error);
        displayOutput({ error: error.message, status: error.status });
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Buscar una cuenta por ID
 */
async function buscarPorId() {
    try {
        const id = document.getElementById('searchId').value.trim();
        
        if (!id) {
            showToast('Por favor ingresa un ID para buscar', 'error');
            return;
        }
        
        const response = await fetch(`${API_BASE}/leer/${id}`);
        const data = await handleResponse(response);
        
        displayOutput(data);
        showToast('✅ Cuenta encontrada', 'success');
    } catch (error) {
        console.error('Error:', error);
        displayOutput({ error: error.message, status: error.status });
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Actualizar una cuenta
 */
async function actualizarRegistro() {
    try {
        const id = document.getElementById('updateId').value.trim();
        const balance = document.getElementById('updateBalance').value.trim();
        
        if (!id) {
            showToast('El ID es requerido', 'error');
            return;
        }
        if (!balance) {
            showToast('El balance es requerido', 'error');
            return;
        }
        
        const response = await fetch(`${API_BASE}/actualizar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id, 
                balance: parseInt(balance) 
            })
        });
        
        const data = await handleResponse(response);
        displayOutput(data);
        
        document.getElementById('updateId').value = '';
        document.getElementById('updateBalance').value = '';
        
        showToast('✅ Cuenta actualizada exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        displayOutput({ error: error.message, status: error.status });
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Eliminar una cuenta
 */
async function eliminarRegistro() {
    try {
        const id = document.getElementById('deleteId').value.trim();
        
        if (!id) {
            showToast('El ID es requerido', 'error');
            return;
        }
        
        if (!confirm(`¿Estás seguro de que deseas eliminar la cuenta con ID: ${id}?`)) {
            return;
        }
        
        const response = await fetch(`${API_BASE}/eliminar`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        const data = await handleResponse(response);
        displayOutput(data);
        
        document.getElementById('deleteId').value = '';
        
        showToast('✅ Cuenta eliminada exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        displayOutput({ error: error.message, status: error.status });
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Inicializar la aplicación y wiring de UI
 */
window.addEventListener('DOMContentLoaded', () => {
    obtenerInfoDB();

    // Tab switching
    const tabs = Array.from(document.querySelectorAll('.module-tab'));
    const panels = Array.from(document.querySelectorAll('.module-panel'));

    function activateModule(targetId) {
        tabs.forEach(t => t.classList.toggle('active', t.dataset.target === targetId));
        panels.forEach(p => {
            const active = p.id === targetId;
            p.classList.toggle('active', active);
            p.setAttribute('aria-hidden', active ? 'false' : 'true');
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => activateModule(tab.dataset.target));
        tab.addEventListener('keydown', (e) => {
            // Basic keyboard navigation for accessibility
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateModule(tab.dataset.target);
            }
        });
    });

    // Default active panel
    activateModule('mod-crear');

    // Button handlers (no inline onclick)
    const btnCrear = document.getElementById('btnCrear');
    const btnLeer = document.getElementById('btnLeer');
    const btnBuscarId = document.getElementById('btnBuscarId');
    const btnActualizar = document.getElementById('btnActualizar');
    const btnEliminar = document.getElementById('btnEliminar');

    btnCrear?.addEventListener('click', crearRegistro);
    btnLeer?.addEventListener('click', leerRegistros);
    btnBuscarId?.addEventListener('click', buscarPorId);
    btnActualizar?.addEventListener('click', actualizarRegistro);
    btnEliminar?.addEventListener('click', eliminarRegistro);

    // Theme toggle
    initThemeToggle();

    // Credits modal
    initCreditsModal();

    // Background gradient animation + bokeh
    initBackgroundAnimation();
});

/** Credits Modal **/
function initCreditsModal() {
    const btnCredits = document.getElementById('btnCredits');
    const modal = document.getElementById('creditsModal');
    const modalClose = modal?.querySelector('.modal-close');
    const modalOverlay = modal?.querySelector('.modal-overlay');

    function openModal() {
        modal?.classList.add('active');
        modal?.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal?.classList.remove('active');
        modal?.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    btnCredits?.addEventListener('click', openModal);
    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });
}

/** Theme Toggle **/
function initThemeToggle() {
    const btnTheme = document.getElementById('btnTheme');
    const themeIcon = btnTheme?.querySelector('.theme-icon');
    const html = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        localStorage.setItem('theme', theme);
    }

    btnTheme?.addEventListener('click', () => {
        const current = html.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });
}

/** Gradient + Bokeh Background **/
function initBackgroundAnimation() {
    // Gradient animation via CSS variables - OPTIMIZED
    let angle = 135;
    let hue1 = 230;
    let hue2 = 270;
    let t = 0;
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 50; // Update every 50ms instead of every frame

    const body = document.body;
    const html = document.documentElement;
    
    const setGradient = () => {
        const isDark = html.getAttribute('data-theme') === 'dark';
        const baseHue1 = isDark ? 220 : 230;
        const baseHue2 = isDark ? 270 : 270;
        const brightness = isDark ? '25%' : '65%';
        
        body.style.setProperty('--grad-angle', `${angle}deg`);
        const c1 = `hsl(${baseHue1 + Math.sin(t * 0.6) * 12}, 70%, ${brightness})`;
        const c2 = `hsl(${baseHue2 + Math.cos(t * 0.5) * 12}, 70%, ${brightness})`;
        body.style.setProperty('--grad-c1', c1);
        body.style.setProperty('--grad-c2', c2);
    };

    // Canvas bokeh - OPTIMIZED
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particles = [];
    const MAX_PARTICLES = 16; // Reduced from 28 for better performance
    let canvasW = 0;
    let canvasH = 0;

    function resize() {
        const { innerWidth: w, innerHeight: h } = window;
        canvasW = w;
        canvasH = h;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);
    }

    function rand(min, max) { 
        return Math.random() * (max - min) + min; 
    }

    function createParticle() {
        const r = rand(15, 60); // Increased min size, decreased max
        const x = rand(-r, canvasW + r);
        const y = rand(-r, canvasH + r);
        const speed = rand(0.02, 0.12); // Slower movement
        const angle = rand(0, Math.PI * 2);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const hue = rand(hue1 - 15, hue2 + 15);
        return { x, y, r, vx, vy, hue, alpha: rand(0.06, 0.15) };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < MAX_PARTICLES; i++) {
            particles.push(createParticle());
        }
    }

    function stepParticles() {
        const boundsX = canvasW;
        const boundsY = canvasH;
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            // wrap around edges
            if (p.x < -p.r) p.x = boundsX + p.r;
            else if (p.x > boundsX + p.r) p.x = -p.r;
            
            if (p.y < -p.r) p.y = boundsY + p.r;
            else if (p.y > boundsY + p.r) p.y = -p.r;
        }
    }

    function renderParticles() {
        ctx.clearRect(0, 0, canvasW, canvasH);
        ctx.globalCompositeOperation = 'screen'; // Changed from 'lighter' for better performance
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            ctx.beginPath();
            ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
            ctx.shadowBlur = 20;
            ctx.shadowColor = `hsla(${p.hue}, 80%, 70%, ${p.alpha * 0.6})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    let rafId = null;
    
    function animate(currentTime) {
        // Throttle updates
        if (currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
            t += 0.005;
            angle = 135 + Math.sin(t) * 8;
            const isDark = html.getAttribute('data-theme') === 'dark';
            hue1 = (isDark ? 220 : 230) + Math.sin(t * 0.6) * 12;
            hue2 = (isDark ? 270 : 270) + Math.cos(t * 0.5) * 12;
            setGradient();
            
            stepParticles();
            renderParticles();
            lastUpdateTime = currentTime;
        }

        rafId = requestAnimationFrame(animate);
    }

    function cleanup() {
        if (rafId) cancelAnimationFrame(rafId);
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    }, { passive: true });

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup, { once: true });

    resize();
    initParticles();
    setGradient();
    animate(0);
}

