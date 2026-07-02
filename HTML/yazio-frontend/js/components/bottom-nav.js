// Bottom Navigation Component
// This component renders a bottom navigation bar for mobile navigation

class BottomNav {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.navItems = [
      { id: 'diary', label: 'Diary', icon: '📔', href: '/views/diary.html' },
      { id: 'fasting', label: 'Fasting', icon: '⏱️', href: '/views/fasting.html' },
      { id: 'recipes', label: 'Recipes', icon: '🍽️', href: '/views/recipes.html' },
      { id: 'analysis', label: 'Analysis', icon: '📊', href: '/views/analysis.html' },
      { id: 'profile', label: 'Profile', icon: '👤', href: '/views/profile.html' },
    ];
  }

  render() {
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    
    const navList = document.createElement('ul');
    navList.className = 'bottom-nav-list';

    this.navItems.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'bottom-nav-item';

      const link = document.createElement('a');
      link.href = item.href;
      link.className = 'bottom-nav-link';
      
      const icon = document.createElement('span');
      icon.className = 'nav-icon';
      icon.textContent = item.icon;

      const label = document.createElement('span');
      label.className = 'nav-label';
      label.textContent = item.label;

      link.appendChild(icon);
      link.appendChild(label);
      li.appendChild(link);
      navList.appendChild(li);
    });

    nav.appendChild(navList);
    this.container.appendChild(nav);
  }

  setActive(itemId) {
    const items = this.container.querySelectorAll('.bottom-nav-item');
    items.forEach((item) => {
      item.classList.remove('active');
    });

    const activeItem = this.container.querySelector(`[data-id="${itemId}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BottomNav;
}
