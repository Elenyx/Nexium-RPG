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
      
      document.getElementById('user-avatar').src = avatarUrl;
      document.getElementById('user-name').textContent = data.discord.username;
      
      // Show user profile, hide login button in header
      document.getElementById('user-profile').style.display = 'flex';
      document.getElementById('login-button-container').style.display = 'none';

      // --- NEW LOGIC FOR CTA SECTION ---
      // Check if we are on the index page where the CTA exists
      const ctaSection = document.getElementById('cta-section');
      if (ctaSection) {
        // Update CTA text
        document.getElementById('cta-heading').textContent = `Welcome Back, ${data.discord.username}!`;
        document.getElementById('cta-subheading').textContent = 'Your adventure awaits. What would you like to do next?';
        
        // Hide the login button and show the dashboard button
        document.getElementById('cta-login-button').style.display = 'none';
        document.getElementById('cta-dashboard-button').style.display = 'inline-block';
      }
      // --- END OF NEW LOGIC ---

    }
  } catch (error) {
    console.error('Not logged in or error fetching profile:', error);
  }
}
