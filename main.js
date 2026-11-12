/**
 * Legacy Beauty Academy - Main JavaScript
 * Includes form validation, password strength, basic security helpers
 */

(function () {
  'use strict';

  // ========== Mobile Navigation ==========
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.textContent = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.textContent = '☰';
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ========== Active Nav Link ==========
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ========== Password Strength ==========
  function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }

  const passwordInput = document.getElementById('password');
  const strengthBar = document.getElementById('password-strength-bar');
  const strengthText = document.getElementById('password-strength-text');

  if (passwordInput && strengthBar) {
    passwordInput.addEventListener('input', function () {
      const val = this.value;
      strengthBar.className = 'password-strength-bar';
      if (!val) {
        strengthBar.style.width = '0%';
        if (strengthText) strengthText.textContent = '';
        return;
      }
      const strength = checkPasswordStrength(val);
      strengthBar.classList.add('strength-' + strength);
      if (strengthText) {
        const labels = { weak: 'Weak – add more characters, numbers & symbols', medium: 'Medium – almost there', strong: 'Strong password' };
        strengthText.textContent = labels[strength];
        strengthText.style.color = strength === 'strong' ? '#2E7D32' : strength === 'medium' ? '#F9A825' : '#C62828';
      }
    });
  }

  // ========== Input Sanitization (basic XSS prevention) ==========
  function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    return str.replace(/[&<>"'/]/g, function (s) { return map[s]; });
  }

  // ========== Registration Form ==========
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      document.querySelectorAll('.form-error').forEach(function (el) {
        el.classList.remove('show');
        el.textContent = '';
      });
      document.querySelectorAll('.form-group input, .form-group select').forEach(function (el) {
        el.classList.remove('error');
      });

      let isValid = true;

      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const course = document.getElementById('course').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const terms = document.getElementById('terms').checked;

      // Full name
      if (fullName.length < 3) {
        showError('fullName', 'Please enter your full name (at least 3 characters).');
        isValid = false;
      } else if (!/^[a-zA-Z\s\-'.]+$/.test(fullName)) {
        showError('fullName', 'Name contains invalid characters.');
        isValid = false;
      }

      // Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address.');
        isValid = false;
      }

      // Phone (basic international / local)
      const phoneClean = phone.replace(/[\s\-\(\)]/g, '');
      if (!/^\+?[0-9]{8,15}$/.test(phoneClean)) {
        showError('phone', 'Please enter a valid phone number (8–15 digits).');
        isValid = false;
      }

      // Course
      if (!course) {
        showError('course', 'Please select a training program.');
        isValid = false;
      }

      // Password
      if (password.length < 8) {
        showError('password', 'Password must be at least 8 characters.');
        isValid = false;
      } else if (checkPasswordStrength(password) === 'weak') {
        showError('password', 'Password is too weak. Use upper/lowercase, numbers and symbols.');
        isValid = false;
      }

      // Confirm
      if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match.');
        isValid = false;
      }

      // Terms
      if (!terms) {
        showError('terms', 'You must agree to the terms and privacy policy.');
        isValid = false;
      }

      if (!isValid) {
        showAlert('error', 'Please correct the errors below and try again.');
        return;
      }

      // Simulate secure submission (in production this would POST to a secure backend over HTTPS)
      // Store sanitized data in localStorage for demo only – NEVER store real passwords in production client-side
      const studentData = {
        id: 'LBA-' + Date.now().toString(36).toUpperCase(),
        fullName: sanitizeInput(fullName),
        email: sanitizeInput(email.toLowerCase()),
        phone: sanitizeInput(phone),
        course: sanitizeInput(course),
        registeredAt: new Date().toISOString(),
        // Password is NEVER stored in plain text. In real systems use bcrypt/argon2 on server.
        passwordHash: '***hashed-on-server***'
      };

      try {
        const existing = JSON.parse(localStorage.getItem('lba_students') || '[]');
        // Check duplicate email
        if (existing.some(function (s) { return s.email === studentData.email; })) {
          showAlert('error', 'An account with this email already exists.');
          return;
        }
        existing.push(studentData);
        localStorage.setItem('lba_students', JSON.stringify(existing));

        showAlert('success', 'Registration successful! Your Student ID is ' + studentData.id + '. You will receive a confirmation email shortly. Welcome to Legacy Beauty Academy!');
        registerForm.reset();
        if (strengthBar) {
          strengthBar.className = 'password-strength-bar';
          strengthBar.style.width = '0%';
        }
        if (strengthText) strengthText.textContent = '';

        // Scroll to top of form
        registerForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (err) {
        showAlert('error', 'Registration failed due to a technical issue. Please try again or contact us.');
        console.error(err);
      }
    });
  }

  function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    if (input) input.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  }

  function showAlert(type, message) {
    const alertBox = document.getElementById('form-alert');
    if (!alertBox) return;
    alertBox.className = 'alert alert-' + type + ' show';
    alertBox.textContent = message;
  }

  // ========== Contact Form (simple) ==========
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
        alert('Please fill all fields correctly.');
        return;
      }

      // Demo only
      alert('Thank you, ' + sanitizeInput(name) + '! Your message has been received. We will contact you at ' + sanitizeInput(email) + ' soon.');
      contactForm.reset();
    });
  }

  // ========== Gallery Modal ==========
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-image');
  const modalClose = document.querySelector('.modal-close');

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      if (img && modal && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ========== Products filter (optional) ==========
  const filterBtns = document.querySelectorAll('[data-filter]');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      productCards.forEach(function (card) {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

})();