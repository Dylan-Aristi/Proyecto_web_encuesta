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

        function goToAttendanceScreen(mealType) {
            if (typeof mealType === 'string') {
                currentState.selectedMealType = mealType;
            }
            
            document.getElementById('attendanceTitle').textContent = currentState.selectedMealType;
            document.getElementById('attendanceSubtitle').textContent = currentState.selectedDay;
            
            goToScreen('attendanceScreen');
        }

        function goToAbsenceScreen() {
            document.getElementById('absenceSubtitle').textContent = `${currentState.selectedDay} - ${currentState.selectedMealType}`;
            document.getElementById('studentNameInput').value = '';
            document.getElementById('studentGradeInput').value = '';
            document.getElementById('absenceReasonInput').value = '';
            
            goToScreen('absenceScreen');
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
        
        function goBackToAttendanceScreen() {
            goToScreen('attendanceScreen');
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
                Asistencia: 'Sí asistió',
                Nombre_Estudiante: studentName,
                Grado: studentGrade,
                Calificacion: currentState.rating,
                Recomendaciones: document.getElementById('recommendationsInput').value || 'Ninguna',
                Motivo_Inasistencia: 'NO APLICA'
            };

            enviarDatos(datos, btnEnviar);
        }

        function sendAbsence() {
            const studentName = document.getElementById('studentNameInput').value.trim();
            const studentGrade = document.getElementById('studentGradeInput').value;
            const absenceReason = document.getElementById('absenceReasonInput').value.trim();

            if (!studentName || !studentGrade || !absenceReason) {
                showCustomAlert('Por favor, completa todos los campos.', 'warning');
                return;
            }

            const btnEnviar = document.getElementById('btnEnviarInasistencia');
            btnEnviar.textContent = 'ENVIANDO...';
            btnEnviar.disabled = true;

            const datos = {
                Dia: currentState.selectedDay,
                Comida: currentState.selectedMealType,
                Asistencia: 'No asistió',
                Nombre_Estudiante: studentName,
                Grado: studentGrade,
                Calificacion: 'NO APLICA',
                Recomendaciones: 'NO APLICA',
                Motivo_Inasistencia: absenceReason
            };

            enviarDatos(datos, btnEnviar);
        }

        function enviarDatos(datos, btnEnviar) {
            // Petición al correo (FormSubmit)
            const emailReq = fetch("https://formsubmit.co/ajax/dylancorrales987@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            // Petición a Google Sheets (usando text/plain para evitar problemas de CORS)
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
                sheetsReq = Promise.resolve(); // Si no hay URL, simplemente resolvemos
            }

            // Esperar a que ambas peticiones terminen
            Promise.all([emailReq, sheetsReq])
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