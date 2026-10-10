const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.textContent = open ? '✕' : '☰';
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    note.textContent = 'Please complete the required fields.';
    note.className = 'form-note error';
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  note.textContent = '';
  note.className = 'form-note';

  try {
    // FormSubmit emails the project inquiry directly to the portfolio owner.
    // The first submission may require activating the address via a confirmation email.
    const response = await fetch('https://formsubmit.co/ajax/torikulislampatoary@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `New Portfolio Project Inquiry - ${service}`,
        _template: 'table',
        _captcha: 'false',
        Name: name,
        'Client Email': email,
        Service: service,
        'Project Details': message
      })
    });

    let data = {};
    try {
      data = await response.json();
    } catch (_) {
      // Keep the response handling below useful if the service returns non-JSON.
    }

    if (!response.ok || data.success === 'false' || data.success === false) {
      throw new Error(data.message || 'Unable to send your inquiry right now. Please try again later.');
    }

    note.textContent = 'Thank you! Your project inquiry has been sent successfully. I will contact you soon.';
    note.className = 'form-note success';
    form.reset();
  } catch (error) {
    console.error('Contact form submission failed:', error);
    note.textContent = error.message || 'Unable to send your inquiry. Please try again or email torikulislampatoary@gmail.com directly.';
    note.className = 'form-note error';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Send Project Inquiry →';
  }
});
