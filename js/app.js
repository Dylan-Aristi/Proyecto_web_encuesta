// ==================== ESTADO GLOBAL ==================== 
        let currentState = {
            selectedDay: null,
            selectedMealType: null,
            rating: 0,
            recommendations: ''
        };

        // ==================== FUNCIONES DE NAVEGACIÓN ====================
        function goToScreen(screenId) {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
        }

        function goToDayScreen(day) {
            currentState.selectedDay = day;
            document.getElementById('dayScreenTitle').textContent = day;
            goToScreen('dayScreen');
        }

        function goToFeedbackScreen(mealType) {
            if (typeof mealType === 'string') {
                currentState.selectedMealType = mealType;
            }
            currentState.rating = 0;
            currentState.recommendations = '';
            
            document.getElementById('feedbackTitle').textContent = currentState.selectedMealType;
            document.getElementById('feedbackSubtitle').textContent = currentState.selectedDay;
            
            document.getElementById('attendanceStudentNameInput').value = '';
            document.getElementById('attendanceStudentGradeInput').value = '';
            
            document.querySelectorAll('.star-button').forEach(btn => {
                btn.classList.remove('filled');
                btn.innerHTML = '<i class="far fa-star"></i>';
            });
            
            document.getElementById('recommendationsInput').value = '';
            document.getElementById('ratingText').style.display = 'none';
            
            goToScreen('feedbackScreen');
        }

        function goBackToDayScreen() {
            goToDayScreen(currentState.selectedDay);
        }

        // ==================== FUNCIONES DE RATING ====================
        function setRating(stars) {
            currentState.rating = stars;
            
            document.querySelectorAll('.star-button').forEach((btn, index) => {
                if (index < stars) {
                    btn.classList.add('filled');
                    btn.innerHTML = '<i class="fas fa-star"></i>';
                } else {
                    btn.classList.remove('filled');
                    btn.innerHTML = '<i class="far fa-star"></i>';
                }
            });
            
            const ratingText = document.getElementById('ratingText');
            ratingText.textContent = `Calificación: ${stars} de 5 estrellas`;
            ratingText.style.display = 'block';
        }

        // ==================== FUNCIÓN DE ENVÍO POR CORREO Y GOOGLE SHEETS ====================
        // Reemplaza esto con la URL que te dará Google Apps Script
        const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyruI4f6MauxXvEFaqd2ilKM85ELwsJo1ht9smncK5kyQQ89uPk6KEtghfj6HYPennK_w/exec";

        // ==================== CUSTOM ALERT FUNCTIONS ====================
        let alertCallback = null;

        function showCustomAlert(message, type = 'success', callback = null) {
            alertCallback = callback;
            const overlay = document.getElementById('customAlertOverlay');
            const icon = document.getElementById('alertIcon');
            const messageEl = document.getElementById('alertMessage');
            
            messageEl.textContent = message;
            
            // Set icon and color based on type
            if (type === 'success') {
                icon.innerHTML = '<i class="fas fa-check-circle"></i>';
                icon.className = 'alert-icon success';
            } else if (type === 'error') {
                icon.innerHTML = '<i class="fas fa-times-circle"></i>';
                icon.className = 'alert-icon error';
            } else if (type === 'warning') {
                icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                icon.className = 'alert-icon warning';
            }
            
            overlay.classList.add('active');
        }

        function closeCustomAlert() {
            const overlay = document.getElementById('customAlertOverlay');
            overlay.classList.remove('active');
            
            if (alertCallback) {
                alertCallback();
                alertCallback = null;
            }
        }

        function sendFeedback() {
            const studentName = document.getElementById('attendanceStudentNameInput').value.trim();
            const studentGrade = document.getElementById('attendanceStudentGradeInput').value;

            if (!studentName || !studentGrade) {
                showCustomAlert('Por favor, ingresa tu nombre y grado.', 'warning');
                return;
            }

            if (currentState.rating === 0) {
                showCustomAlert('Por favor, selecciona una calificación', 'warning');
                return;
            }

            const btnEnviar = document.querySelector('#feedbackScreen .button-enviar');
            btnEnviar.textContent = 'ENVIANDO...';
            btnEnviar.disabled = true;

            const datos = {
                Dia: currentState.selectedDay,
                Comida: currentState.selectedMealType,
                Nombre_Estudiante: studentName,
                Grado: studentGrade,
                Calificacion: currentState.rating,
                Recomendaciones: document.getElementById('recommendationsInput').value || 'Ninguna'
            };

            enviarDatos(datos, btnEnviar);
        }

        function enviarDatos(datos, btnEnviar) {
            // Petición al correo (FormSubmit) - Se ejecuta en segundo plano (Fire-and-forget)
            fetch("https://formsubmit.co/ajax/dylancorrales987@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datos)
            }).catch(error => console.log("Error silencioso en el correo:", error));

            // Petición a Google Sheets (muy rápida)
            let sheetsReq;
            if (GOOGLE_SHEETS_URL !== "REEMPLAZA_ESTO_CON_LA_URL_DE_APPS_SCRIPT") {
                sheetsReq = fetch(GOOGLE_SHEETS_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: JSON.stringify(datos)
                });
            } else {
                sheetsReq = Promise.resolve(); 
            }

            // Esperar solo a Google Sheets para liberar al usuario casi inmediatamente
            sheetsReq
            .then(() => {
                showCustomAlert('¡Gracias!\nLa información ha sido registrada correctamente.', 'success', () => {
                    btnEnviar.textContent = 'ENVIAR';
                    btnEnviar.disabled = false;
                    goToScreen('homeScreen');
                });
            })
            .catch(error => {
                showCustomAlert('Hubo un error de conexión. Por favor intenta de nuevo.', 'error');
                btnEnviar.textContent = 'ENVIAR';
                btnEnviar.disabled = false;
            });
        }

        // ==================== PREVENIR SCROLL EN CUERPO ====================
        document.body.addEventListener('touchmove', function(e) {
            if (e.target.closest('.days-container') || 
                e.target.closest('.scroll-content') || 
                e.target.closest('.feedback-scroll')) {
                return;
            }
            e.preventDefault();
        }, { passive: false });

        // ==================== EFECTOS VISUALES PANTALLA INICIO ====================
        const welcomeScreen = document.getElementById('welcomeScreen');
        welcomeScreen.style.position = 'relative';
        welcomeScreen.style.overflow = 'hidden';
        
        const btnIniciar = welcomeScreen.querySelector('.button-large');

        welcomeScreen.addEventListener('click', function(e) {
            // Si el click no fue sobre el botón "INICIAR"
            if (!e.target.closest('.button-large')) {
                
                // 1. Crear el efecto Ripple (Onda)
                const ripple = document.createElement('div');
                ripple.classList.add('ripple-effect');
                
                // Establecer un tamaño fijo pequeño para simular la gota
                const rect = welcomeScreen.getBoundingClientRect();
                const diameter = 120; // 120 píxeles de diámetro máximo
                const radius = diameter / 2;
                
                ripple.style.width = ripple.style.height = `${diameter}px`;
                ripple.style.left = `${e.clientX - rect.left - radius}px`;
                ripple.style.top = `${e.clientY - rect.top - radius}px`;
                
                welcomeScreen.appendChild(ripple);
                
                // Eliminar el elemento del HTML cuando termine la animación (600ms)
                setTimeout(() => {
                    ripple.remove();
                }, 600);

                // 2. Hacer temblar el botón para llamar la atención
                // Forzamos un reinicio de la animación por si hacen varios clics seguidos
                btnIniciar.classList.remove('attention-shake');
                void btnIniciar.offsetWidth; // Trigger reflow
                btnIniciar.classList.add('attention-shake');
                
                // Remover la clase cuando termine (500ms) para que se pueda volver a usar
                setTimeout(() => {
                    btnIniciar.classList.remove('attention-shake');
                }, 500);
            }
        });