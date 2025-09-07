// Authentication related functionality
document.addEventListener('DOMContentLoaded', async function() {
  // Check if user is logged in
  checkLogin();

  // Set up logout button
  document.getElementById('logout-button')?.addEventListener('click', async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
      location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  });
});

// Function to check if user is logged in
// Function to check if user is logged in
async function checkLogin() {
  try {
    const response = await fetch('/me');
    if (response.ok) {
      const data = await response.json();
      
      // Display user info in header
      const avatarUrl = data.discord.avatar ? 
        `https://cdn.discordapp.com/avatars/${data.discord.id}/${data.discord.avatar}.png` :
        'https://cdn.discordapp.com/embed/avatars/0.png'; // Default avatar
      
      const avatarEl = document.getElementById('user-avatar');
      const nameEl = document.getElementById('user-name');
      const userProfileEl = document.getElementById('user-profile');
      const loginContainerEl = document.getElementById('login-button-container');

      if (avatarEl) avatarEl.src = avatarUrl;
      if (nameEl) nameEl.textContent = data.discord.username;

      // Show user profile and keep login container space to avoid nav shifting.
      if (userProfileEl) {
        userProfileEl.style.display = 'flex';
        userProfileEl.style.visibility = 'visible';
        userProfileEl.style.alignItems = 'center';
      }
      if (loginContainerEl) {
        // Hide the login link visually but keep its layout space so the nav doesn't shrink
        loginContainerEl.style.visibility = 'hidden';
        loginContainerEl.style.pointerEvents = 'none';
        loginContainerEl.setAttribute('aria-hidden', 'true');
      }

      // --- NEW LOGIC FOR CTA SECTION ---
      // Check if we are on the index page where the CTA exists
      const ctaSection = document.getElementById('cta-section');
      if (ctaSection) {
        // Update CTA text
        document.getElementById('cta-heading').textContent = `Welcome Back, ${data.discord.username}!`;
        document.getElementById('cta-subheading').textContent = 'Your adventure awaits. What would you like to do next?';
        
        // Hide the login button visually but keep layout (use visibility so layout is stable)
        const ctaLoginBtn = document.getElementById('cta-login-button');
        const ctaDashboardBtn = document.getElementById('cta-dashboard-button');
        if (ctaLoginBtn) {
          ctaLoginBtn.style.visibility = 'hidden';
          ctaLoginBtn.style.pointerEvents = 'none';
          ctaLoginBtn.setAttribute('aria-hidden', 'true');
        }
        if (ctaDashboardBtn) {
          ctaDashboardBtn.style.display = 'inline-block';
        }
      }
      // --- END OF NEW LOGIC ---

    }
  } catch (error) {
    console.error('Not logged in or error fetching profile:', error);
  }
}

// Ensure CTA and nav login buttons open the same auth path and remain in sync
document.addEventListener('DOMContentLoaded', function() {
  const navLoginLink = document.querySelector('#login-button-container a');
  const ctaLogin = document.getElementById('cta-login-button');

  if (navLoginLink && ctaLogin) {
    // Make CTA link use same href as nav login
    ctaLogin.href = navLoginLink.href || ctaLogin.getAttribute('href');

    // Clicking CTA should behave the same (open auth path)
    ctaLogin.addEventListener('click', (e) => {
      // allow default navigation to /auth/discord
    });
  }
});
