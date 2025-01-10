import { View } from '../core/view.js';
import { Model } from '../core/model.js';
import { Controller } from '../core/controller.js';

export class NotificationModel extends Model {
  constructor(controller) {
    super(controller);
    this.notifications = [];
  }

  addNotification(notification) {
    this.notifications.push({
      id: Date.now(),
      title: notification.title || 'Notice',
      text: notification.text || '',
      timeout: notification.timeout || 5,
      anchor: notification.anchor || 'top right'
    });
    this.notifyView();
  }

  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyView();
  }
}

export class NotificationView extends View {
  constructor(controller) {
    super(controller);
    this.setupContainer();
    this.setupStyles();
  }

  setupContainer() {
    this.container = document.createElement('div');
    this.container.className = 'notifications-container';
    document.body.appendChild(this.container);
  }

  setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .notifications-container {
        position: fixed;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px;
        pointer-events: none;
      }
      
      .notification {
        background: white;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: flex-start;
        gap: 12px;
        min-width: 300px;
        max-width: 400px;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease,
                    box-shadow 0.2s ease;
        pointer-events: all;
      }

      .notification:hover {
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      }

      .notification.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .notification.hiding {
        opacity: 0;
        transform: translateY(-20px);
      }

      .notification-content {
        flex: 1;
      }

      .notification-title {
        font-weight: bold;
        margin-bottom: 4px;
      }

      .notification-close {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.2s ease;
      }

      .notification-close:hover {
        opacity: 1;
      }

      .notification-close img {
        width: 30px;
        height: 30px;
      }
    `;
    document.head.appendChild(style);
  }

  createNotificationElement(notification) {
    const element = document.createElement('div');
    element.className = 'notification';
    element.dataset.id = notification.id;
    
    element.innerHTML = `
      <div class="notification-content">
        <div class="notification-title">${notification.title}</div>
        <div class="notification-text">${notification.text}</div>
      </div>
      <button class="notification-close">
        <img src="/assets/icons/xmark.svg" alt="Close">
      </button>
    `;

    element.querySelector('.notification-close').addEventListener('click', () => {
      this.controller.removeNotification(notification.id);
    });

    return element;
  }

  updateContainerPosition(anchor) {
    this.container.style.top = anchor.includes('top') ? '0' : 'auto';
    this.container.style.bottom = anchor.includes('bottom') ? '0' : 'auto';
    this.container.style.left = anchor.includes('left') ? '0' : 'auto';
    this.container.style.right = anchor.includes('right') ? '0' : 'auto';
  }

  async showNotification(element) {
    this.container.appendChild(element);
    // Force reflow to ensure animation plays
    element.offsetHeight;
    element.classList.add('visible');
    
    return new Promise(resolve => {
      element.addEventListener('transitionend', () => resolve(), { once: true });
    });
  }

  async hideNotification(element) {
    return new Promise(resolve => {
      const handleTransitionEnd = () => {
        element.removeEventListener('transitionend', handleTransitionEnd);
        element.remove();
        resolve();
      };

      element.addEventListener('transitionend', handleTransitionEnd);
      element.classList.remove('visible');
      element.classList.add('hiding');
    });
  }

  update(model) {
    if (model.notifications.length > 0) {
      this.updateContainerPosition(model.notifications[0].anchor);
    }

    // Add new notifications
    model.notifications.forEach(notification => {
      if (!this.container.querySelector(`[data-id="${notification.id}"]`)) {
        const element = this.createNotificationElement(notification);
        this.showNotification(element);
      }
    });

    // Remove old notifications
    Array.from(this.container.children).forEach(element => {
      const id = parseInt(element.dataset.id);
      if (!model.notifications.find(n => n.id === id)) {
        this.hideNotification(element);
      }
    });
  }
}

export class NotificationController extends Controller {
  constructor() {
    super(new NotificationModel(), new NotificationView());
  }

  create_notification({ title, text, timeout, anchor }) {
    this.model.addNotification({ title, text, timeout, anchor });
    
    if (timeout) {
      const notification = this.model.notifications[this.model.notifications.length - 1];
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, timeout * 1000);
    }
  }

  async removeNotification(id) {
    const element = this.view.container.querySelector(`[data-id="${id}"]`);
    if (element) {
      await this.view.hideNotification(element);
      this.model.removeNotification(id);
    }
  }
} 