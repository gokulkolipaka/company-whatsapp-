// Company Messaging App - WhatsApp Style
// Optimized for GitHub Pages deployment

class MessagingApp {
    constructor() {
        this.currentUser = null;
        this.currentChat = null;
        this.users = [];
        this.groups = [];
        this.messages = [];
        this.settings = {};
        this.notifications = [];
        this.heartbeatInterval = null;
        
        // Bind methods to this context
        this.init = this.init.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.switchAuthTab = this.switchAuthTab.bind(this);
        
        // Initialize app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.init);
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing Messaging App...');
        this.loadData();
        this.checkNetworkRestriction();
        this.showAuthPage();
        this.setupEventListeners();
        this.setupGlobalFunctions();
        this.startAutoSave();
    }

    setupGlobalFunctions() {
        // Make functions globally available for onclick handlers
        window.app = this;
        window.switchAuthTab = (tab) => this.switchAuthTab(tab);
        window.handleLogin = (event) => this.handleLogin(event);
        window.handleRegister = (event) => this.handleRegister(event);
        window.showForgotPassword = () => this.showModal('forgotPasswordModal');
        window.showAdminPanel = () => this.showAdminPanel();
        window.switchAdminTab = (tab) => this.switchAdminTab(tab);
        window.updateBranding = (event) => this.updateBranding(event);
        window.updateSettings = (event) => this.updateSettings(event);
        window.toggleAppDisable = () => this.toggleAppDisable();
        window.createGroup = (event) => this.createGroup(event);
        window.showCreateGroup = () => this.showCreateGroup();
        window.changeUserPassword = (event) => this.changeUserPassword(event);
        window.skipPasswordChange = () => this.skipPasswordChange();
        window.resetPassword = (event) => this.resetPassword(event);
        window.showProfile = () => this.showProfile();
        window.updateProfile = (event) => this.updateProfile(event);
        window.showChangePassword = () => this.showChangePassword();
        window.showChatInfo = () => this.showChatInfo();
        window.closeModal = (modalId) => this.closeModal(modalId);
        window.logout = () => this.logout();
        window.sendMessage = () => this.sendMessage();
        window.selectFile = (type) => this.selectFile(type);
        window.toggleAttachmentMenu = () => this.toggleAttachmentMenu();
        window.toggleEmojiPicker = () => this.toggleEmojiPicker();
        window.insertEmoji = (emoji) => this.insertEmoji(emoji);
        window.handleMessageKeyPress = (event) => this.handleMessageKeyPress(event);
        window.filterChats = (query) => this.filterChats(query);
    }

    setupEventListeners() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.attachment-btn') && !e.target.closest('.attachment-menu')) {
                document.getElementById('attachmentMenu').classList.add('hidden');
            }
            if (!e.target.closest('.emoji-btn') && !e.target.closest('.emoji-picker')) {
                document.getElementById('emojiPicker').classList.add('hidden');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal:not(.hidden)');
                modals.forEach(modal => this.closeModal(modal.id));
                
                document.getElementById('attachmentMenu').classList.add('hidden');
                document.getElementById('emojiPicker').classList.add('hidden');
            }
        });
    }

    // Data Management
    loadData() {
        // Load sample data if not exists
        if (!localStorage.getItem('messaging_users')) {
            const sampleData = {
                users: [
                    {
                        id: "admin",
                        phoneNumber: "admin",
                        email: "admin@company.com",
                        name: "System Administrator",
                        profilePic: "",
                        lastSeen: new Date().toISOString(),
                        isOnline: true,
                        isAdmin: true,
                        passwordChanged: false,
                        password: "GravitiAdmin2025!"
                    },
                    {
                        id: "user1",
                        phoneNumber: "+1234567890",
                        email: "john@company.com",
                        name: "John Smith",
                        profilePic: "",
                        lastSeen: new Date().toISOString(),
                        isOnline: true,
                        isAdmin: false,
                        password: "password123"
                    },
                    {
                        id: "user2",
                        phoneNumber: "+1234567891",
                        email: "jane@company.com",
                        name: "Jane Doe",
                        profilePic: "",
                        lastSeen: new Date().toISOString(),
                        isOnline: false,
                        isAdmin: false,
                        password: "password123"
                    },
                    {
                        id: "user3",
                        phoneNumber: "+1234567892",
                        email: "mike@company.com",
                        name: "Mike Johnson",
                        profilePic: "",
                        lastSeen: new Date(Date.now() - 300000).toISOString(),
                        isOnline: false,
                        isAdmin: false,
                        password: "password123"
                    }
                ],
                groups: [
                    {
                        id: "group1",
                        name: "General Discussion",
                        members: ["admin", "user1", "user2", "user3"],
                        createdBy: "admin",
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: "group2",
                        name: "Development Team",
                        members: ["admin", "user1", "user2"],
                        createdBy: "admin",
                        createdAt: new Date().toISOString()
                    }
                ],
                messages: [
                    {
                        id: "msg1",
                        sender: "admin",
                        receiver: "group1",
                        content: "Welcome to the company messaging platform! 🎉",
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        type: "text",
                        status: "read",
                        mentions: []
                    },
                    {
                        id: "msg2",
                        sender: "user1",
                        receiver: "group1",
                        content: "Thanks for setting this up @admin! This looks great 👍",
                        timestamp: new Date(Date.now() - 3300000).toISOString(),
                        type: "text",
                        status: "read",
                        mentions: ["admin"]
                    },
                    {
                        id: "msg3",
                        sender: "user2",
                        receiver: "group1",
                        content: "Excited to use this for our team communications!",
                        timestamp: new Date(Date.now() - 3000000).toISOString(),
                        type: "text",
                        status: "read",
                        mentions: []
                    },
                    {
                        id: "msg4",
                        sender: "admin",
                        receiver: "user1",
                        content: "Hey John, can you review the project proposal?",
                        timestamp: new Date(Date.now() - 1800000).toISOString(),
                        type: "text",
                        status: "delivered",
                        mentions: []
                    },
                    {
                        id: "msg5",
                        sender: "user1",
                        receiver: "admin",
                        content: "Sure! I'll take a look at it this afternoon 📋",
                        timestamp: new Date(Date.now() - 1500000).toISOString(),
                        type: "text",
                        status: "read",
                        mentions: []
                    }
                ],
                settings: {
                    companyName: "GravitiCorp",
                    logoUrl: "",
                    allowedIPs: ["192.168.1.0/24", "10.0.0.0/8", "0.0.0.0/0"],
                    appDisabled: false,
                    disableUntil: null
                }
            };

            localStorage.setItem('messaging_users', JSON.stringify(sampleData.users));
            localStorage.setItem('messaging_groups', JSON.stringify(sampleData.groups));
            localStorage.setItem('messaging_messages', JSON.stringify(sampleData.messages));
            localStorage.setItem('messaging_settings', JSON.stringify(sampleData.settings));
        }

        this.users = JSON.parse(localStorage.getItem('messaging_users') || '[]');
        this.groups = JSON.parse(localStorage.getItem('messaging_groups') || '[]');
        this.messages = JSON.parse(localStorage.getItem('messaging_messages') || '[]');
        this.settings = JSON.parse(localStorage.getItem('messaging_settings') || '{}');
    }

    saveData() {
        localStorage.setItem('messaging_users', JSON.stringify(this.users));
        localStorage.setItem('messaging_groups', JSON.stringify(this.groups));
        localStorage.setItem('messaging_messages', JSON.stringify(this.messages));
        localStorage.setItem('messaging_settings', JSON.stringify(this.settings));
    }

    startAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveData();
        }, 30000);
    }

    // Network Restriction Check
    checkNetworkRestriction() {
        // Simulate network check - in demo mode, always allow access
        const isDemoMode = window.location.hostname.includes('github.io') || 
                          window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1';
        
        if (isDemoMode) {
            return true;
        }

        // In a real environment, this would check actual IP restrictions
        const isAllowed = Math.random() > 0.1; // 90% chance of being allowed
        if (!isAllowed) {
            document.getElementById('networkWarning').classList.remove('hidden');
            return false;
        }
        return true;
    }

    // Authentication
    showAuthPage() {
        document.getElementById('authPage').classList.remove('hidden');
        document.getElementById('chatApp').classList.add('hidden');
        this.updateBrandingDisplay();
    }

    updateBrandingDisplay() {
        const logoElements = ['authLogo', 'appLogo'];
        const nameElements = ['authCompanyName', 'appCompanyName'];

        logoElements.forEach(id => {
            const elem = document.getElementById(id);
            if (elem && this.settings.logoUrl) {
                elem.src = this.settings.logoUrl;
                elem.classList.remove('hidden');
            } else if (elem) {
                elem.classList.add('hidden');
            }
        });

        nameElements.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) {
                elem.textContent = this.settings.companyName || 'GravitiCorp Messenger';
            }
        });
    }

    switchAuthTab(tab) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const tabs = document.querySelectorAll('.auth-tab');

        tabs.forEach(t => t.classList.remove('active'));

        tabs.forEach(tabElement => {
            if ((tab === 'login' && tabElement.textContent.includes('Sign In')) ||
                (tab === 'register' && tabElement.textContent.includes('Register'))) {
                tabElement.classList.add('active');
            }
        });

        if (tab === 'login') {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    handleLogin(event) {
        event.preventDefault();
        const phoneNumber = document.getElementById('loginPhone').value.trim();
        const password = document.getElementById('loginPassword').value;
        this.login(phoneNumber, password);
    }

    handleRegister(event) {
        event.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const phoneNumber = document.getElementById('registerPhone').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        this.register(name, phoneNumber, email, password);
    }

    login(phoneNumber, password) {
        const user = this.users.find(u => 
            (u.phoneNumber === phoneNumber || u.email === phoneNumber) && 
            u.password === password
        );

        if (user) {
            this.currentUser = user;
            user.isOnline = true;
            user.lastSeen = new Date().toISOString();
            this.saveData();

            document.getElementById('authPage').classList.add('hidden');
            document.getElementById('chatApp').classList.remove('hidden');

            if (user.isAdmin) {
                document.getElementById('adminBtn').style.display = 'block';
                if (!user.passwordChanged) {
                    setTimeout(() => {
                        this.showModal('passwordModal');
                    }, 1000);
                }
            }

            this.loadChatInterface();
            this.showNotification('Login successful! Welcome back.', 'success');
        } else {
            this.showNotification('Invalid credentials! Please try again.', 'error');
        }
    }

    register(name, phoneNumber, email, password) {
        if (this.users.find(u => u.phoneNumber === phoneNumber)) {
            this.showNotification('Phone number already registered!', 'error');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            this.showNotification('Email already registered!', 'error');
            return;
        }

        const newUser = {
            id: 'user_' + Date.now(),
            phoneNumber,
            email,
            name,
            profilePic: '',
            lastSeen: new Date().toISOString(),
            isOnline: true,
            isAdmin: false,
            password,
            passwordChanged: true
        };

        this.users.push(newUser);
        this.saveData();
        this.showNotification('Registration successful! Please login.', 'success');
        this.switchAuthTab('login');
    }

    logout() {
        if (this.currentUser) {
            this.currentUser.isOnline = false;
            this.currentUser.lastSeen = new Date().toISOString();
            this.saveData();
        }

        this.currentUser = null;
        this.currentChat = null;
        this.stopHeartbeat();
        this.showAuthPage();
        this.showNotification('Logged out successfully', 'info');
    }

    // Chat Interface
    loadChatInterface() {
        this.updateBrandingDisplay();
        this.loadChatList();
        this.showWelcomeScreen();
        this.startHeartbeat();
    }

    loadChatList() {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;

        chatList.innerHTML = '';

        // Add individual users
        this.users.forEach(user => {
            if (user.id !== this.currentUser.id) {
                this.createChatItem(user, 'user');
            }
        });

        // Add groups
        this.groups.forEach(group => {
            if (group.members.includes(this.currentUser.id)) {
                this.createChatItem(group, 'group');
            }
        });
    }

    createChatItem(chat, type) {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;

        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.onclick = (e) => {
            e.preventDefault();
            this.selectChat(chat, type);
        };

        const lastMessage = this.getLastMessage(chat.id);
        const unreadCount = this.getUnreadCount(chat.id);

        const avatar = type === 'group' ? 
            chat.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase() :
            chat.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();

        const status = type === 'group' ? 
            `${chat.members.length} members` :
            chat.isOnline ? 'Online' : `Last seen ${this.formatTime(chat.lastSeen)}`;

        chatItem.innerHTML = `
            <div class="avatar ${type === 'user' && chat.isOnline ? 'online-indicator' : ''}">${avatar}</div>
            <div class="chat-item-content">
                <div class="chat-item-header">
                    <span class="chat-item-name">${chat.name}</span>
                    <span class="chat-item-time">${lastMessage ? this.formatTime(lastMessage.timestamp) : ''}</span>
                </div>
                <div class="chat-item-message">${lastMessage ? this.truncateMessage(lastMessage.content) : 'No messages yet'}</div>
            </div>
            ${unreadCount > 0 ? `<div class="unread-count">${unreadCount}</div>` : ''}
        `;

        chatList.appendChild(chatItem);
    }

    selectChat(chat, type) {
        this.currentChat = { ...chat, type };
        
        // Update active chat in sidebar
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');

        this.showChatWindow();
        this.loadMessages();
        this.markMessagesAsRead(chat.id);
    }

    showWelcomeScreen() {
        document.getElementById('welcomeScreen').classList.remove('hidden');
        document.getElementById('chatWindow').classList.add('hidden');
    }

    showChatWindow() {
        document.getElementById('welcomeScreen').classList.add('hidden');
        document.getElementById('chatWindow').classList.remove('hidden');

        // Update chat header
        const chatAvatar = document.getElementById('chatAvatar');
        const chatName = document.getElementById('chatName');
        const chatStatus = document.getElementById('chatStatus');

        if (chatAvatar && chatName && chatStatus) {
            const avatar = this.currentChat.type === 'group' ? 
                this.currentChat.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase() :
                this.currentChat.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();

            chatAvatar.textContent = avatar;
            chatName.textContent = this.currentChat.name;

            if (this.currentChat.type === 'group') {
                chatStatus.textContent = `${this.currentChat.members.length} members`;
            } else {
                chatStatus.textContent = this.currentChat.isOnline ? 'Online' : `Last seen ${this.formatTime(this.currentChat.lastSeen)}`;
            }
        }

        // Focus message input
        document.getElementById('messageInput').focus();
    }

    loadMessages() {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer || !this.currentChat) return;

        messagesContainer.innerHTML = '';

        const chatMessages = this.messages.filter(msg => 
            (msg.sender === this.currentChat.id && msg.receiver === this.currentUser.id) ||
            (msg.sender === this.currentUser.id && msg.receiver === this.currentChat.id) ||
            (msg.receiver === this.currentChat.id && this.currentChat.type === 'group')
        );

        chatMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        chatMessages.forEach(message => {
            this.renderMessage(message);
        });

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        const isSent = message.sender === this.currentUser.id;
        messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;

        let senderName = '';
        if (!isSent && this.currentChat.type === 'group') {
            const sender = this.users.find(u => u.id === message.sender);
            senderName = sender ? sender.name : 'Unknown User';
        }

        const processedContent = this.processMentions(message.content);

        messageDiv.innerHTML = `
            ${!isSent && this.currentChat.type === 'group' ? 
                `<div class="message-sender" style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 2px;">${senderName}</div>` : 
                ''
            }
            <div class="message-bubble">
                <p class="message-content">${processedContent}</p>
                <div class="message-time">
                    ${this.formatTime(message.timestamp)}
                    ${isSent ? `<span class="message-status">${this.getStatusIcon(message.status)}</span>` : ''}
                </div>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput || !this.currentChat) return;

        const content = messageInput.value.trim();
        if (!content) return;

        const message = {
            id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            sender: this.currentUser.id,
            receiver: this.currentChat.id,
            content: content,
            timestamp: new Date().toISOString(),
            type: 'text',
            status: 'sent',
            mentions: this.extractMentions(content)
        };

        this.messages.push(message);
        this.saveData();
        this.renderMessage(message);

        // Clear input
        messageInput.value = '';

        // Scroll to bottom
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulate message delivery
        setTimeout(() => {
            message.status = 'delivered';
            this.saveData();
            this.updateMessageStatus(message.id, 'delivered');
        }, 1000);

        // Simulate message read (for direct messages)
        if (this.currentChat.type === 'user') {
            setTimeout(() => {
                message.status = 'read';
                this.saveData();
                this.updateMessageStatus(message.id, 'read');
            }, 3000);
        }

        // Update chat list
        this.loadChatList();
        // Reselect current chat to maintain active state
        setTimeout(() => {
            const chatItems = document.querySelectorAll('.chat-item');
            chatItems.forEach(item => {
                if (item.querySelector('.chat-item-name').textContent === this.currentChat.name) {
                    item.classList.add('active');
                }
            });
        }, 100);
    }

    handleMessageKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    // Utility Functions
    getLastMessage(chatId) {
        const chatMessages = this.messages.filter(msg => 
            msg.sender === chatId || msg.receiver === chatId
        );
        return chatMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    }

    getUnreadCount(chatId) {
        return this.messages.filter(msg => 
            msg.sender === chatId && 
            msg.receiver === this.currentUser.id && 
            msg.status !== 'read'
        ).length;
    }

    markMessagesAsRead(chatId) {
        this.messages.forEach(msg => {
            if (msg.sender === chatId && msg.receiver === this.currentUser.id) {
                msg.status = 'read';
            }
        });
        this.saveData();
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }

    truncateMessage(message, length = 50) {
        return message.length > length ? message.substring(0, length) + '...' : message;
    }

    getStatusIcon(status) {
        switch (status) {
            case 'sent':
                return '<i class="fas fa-check" style="color: var(--color-text-secondary);"></i>';
            case 'delivered':
                return '<i class="fas fa-check-double" style="color: var(--color-text-secondary);"></i>';
            case 'read':
                return '<i class="fas fa-check-double" style="color: var(--color-primary);"></i>';
            default:
                return '';
        }
    }

    updateMessageStatus(messageId, status) {
        const message = this.messages.find(m => m.id === messageId);
        if (message) {
            message.status = status;
            // Update UI if message is visible
            const messageElement = document.querySelector(`[data-message-id="${messageId}"] .message-status`);
            if (messageElement) {
                messageElement.innerHTML = this.getStatusIcon(status);
            }
        }
    }

    processMentions(content) {
        return content.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
    }

    extractMentions(content) {
        const mentions = [];
        const regex = /@(\w+)/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            mentions.push(match[1]);
        }
        return mentions;
    }

    // Search and Filter
    filterChats(query) {
        const chatItems = document.querySelectorAll('.chat-item');
        chatItems.forEach(item => {
            const name = item.querySelector('.chat-item-name').textContent.toLowerCase();
            const message = item.querySelector('.chat-item-message').textContent.toLowerCase();
            const searchQuery = query.toLowerCase();
            
            if (name.includes(searchQuery) || message.includes(searchQuery)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // File and Media
    selectFile(type) {
        // In a real app, this would open file picker
        this.showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} sharing coming soon!`, 'info');
        this.toggleAttachmentMenu();
    }

    toggleAttachmentMenu() {
        const menu = document.getElementById('attachmentMenu');
        menu.classList.toggle('hidden');
    }

    toggleEmojiPicker() {
        const picker = document.getElementById('emojiPicker');
        picker.classList.toggle('hidden');
    }

    insertEmoji(emoji) {
        const messageInput = document.getElementById('messageInput');
        const cursorPos = messageInput.selectionStart;
        const textBefore = messageInput.value.substring(0, cursorPos);
        const textAfter = messageInput.value.substring(cursorPos);
        
        messageInput.value = textBefore + emoji + textAfter;
        messageInput.focus();
        messageInput.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
    }

    // Modals
    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        
        // Pre-populate forms based on modal type
        if (modalId === 'profileModal' && this.currentUser) {
            document.getElementById('profileName').value = this.currentUser.name;
            document.getElementById('profileEmail').value = this.currentUser.email;
            document.getElementById('profilePhone').value = this.currentUser.phoneNumber;
        }
        
        if (modalId === 'adminModal') {
            this.loadAdminData();
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    // Profile Management
    showProfile() {
        this.showModal('profileModal');
    }

    updateProfile(event) {
        event.preventDefault();
        
        const name = document.getElementById('profileName').value.trim();
        const email = document.getElementById('profileEmail').value.trim();
        
        if (!name || !email) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        this.currentUser.name = name;
        this.currentUser.email = email;
        
        // Update user in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
        }
        
        this.saveData();
        this.closeModal('profileModal');
        this.showNotification('Profile updated successfully!', 'success');
        
        // Refresh chat list to show updated name
        this.loadChatList();
    }

    showChangePassword() {
        this.closeModal('profileModal');
        this.showModal('passwordModal');
    }

    changeUserPassword(event) {
        event.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (this.currentUser.password !== currentPassword) {
            this.showNotification('Current password is incorrect', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            return;
        }
        
        this.currentUser.password = newPassword;
        this.currentUser.passwordChanged = true;
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
        }
        
        this.saveData();
        this.closeModal('passwordModal');
        this.showNotification('Password changed successfully!', 'success');
        
        // Clear form
        document.getElementById('passwordForm').reset();
    }

    skipPasswordChange() {
        this.closeModal('passwordModal');
        this.showNotification('Password change skipped. Remember to change it later for security.', 'warning');
    }

    resetPassword(event) {
        event.preventDefault();
        const phoneOrEmail = document.getElementById('resetPhone').value.trim();
        
        const user = this.users.find(u => u.phoneNumber === phoneOrEmail || u.email === phoneOrEmail);
        if (user) {
            this.showNotification('Password reset instructions sent! (Demo: Use "newpassword123")', 'success');
            // In demo, actually reset the password
            user.password = 'newpassword123';
            this.saveData();
        } else {
            this.showNotification('User not found with that phone number or email', 'error');
        }
        
        this.closeModal('forgotPasswordModal');
    }

    // Admin Panel
    showAdminPanel() {
        this.showModal('adminModal');
        this.loadAdminData();
    }

    loadAdminData() {
        this.loadUsersList();
        this.loadAdminSettings();
        this.loadBrandingData();
    }

    loadUsersList() {
        const usersList = document.getElementById('usersList');
        if (!usersList) return;

        usersList.innerHTML = '';

        this.users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            
            const statusClass = user.isOnline ? 'online' : 'offline';
            const statusText = user.isOnline ? 'Online' : `Last seen ${this.formatTime(user.lastSeen)}`;
            
            userItem.innerHTML = `
                <div class="user-info">
                    <div class="user-name">${user.name} ${user.isAdmin ? '(Admin)' : ''}</div>
                    <div class="user-phone">${user.phoneNumber} • ${user.email}</div>
                </div>
                <div class="user-status">
                    <span class="status-indicator ${statusClass}"></span>
                    <span>${statusText}</span>
                </div>
            `;
            
            usersList.appendChild(userItem);
        });
    }

    loadAdminSettings() {
        const allowedIPsTextarea = document.getElementById('allowedIPs');
        const disableButton = document.getElementById('disableButtonText');
        const disableUntilInput = document.getElementById('disableUntil');
        
        if (allowedIPsTextarea) {
            allowedIPsTextarea.value = this.settings.allowedIPs ? this.settings.allowedIPs.join('\n') : '';
        }
        
        if (disableButton) {
            disableButton.textContent = this.settings.appDisabled ? 'Enable App' : 'Disable App';
        }
        
        if (disableUntilInput && this.settings.disableUntil) {
            disableUntilInput.value = this.settings.disableUntil;
        }
    }

    loadBrandingData() {
        const companyNameInput = document.getElementById('companyName');
        const logoUrlInput = document.getElementById('logoUrl');
        
        if (companyNameInput) {
            companyNameInput.value = this.settings.companyName || '';
        }
        
        if (logoUrlInput) {
            logoUrlInput.value = this.settings.logoUrl || '';
        }
    }

    switchAdminTab(tab) {
        const tabs = document.querySelectorAll('.admin-tab');
        const contents = document.querySelectorAll('.admin-tab-content');
        
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        document.querySelector(`.admin-tab:nth-child(${tab === 'users' ? '1' : tab === 'settings' ? '2' : '3'})`).classList.add('active');
        document.getElementById(`admin${tab.charAt(0).toUpperCase() + tab.slice(1)}Tab`).classList.add('active');
    }

    updateSettings(event) {
        event.preventDefault();
        
        const allowedIPsText = document.getElementById('allowedIPs').value;
        const disableUntil = document.getElementById('disableUntil').value;
        
        this.settings.allowedIPs = allowedIPsText.split('\n').filter(ip => ip.trim());
        this.settings.disableUntil = disableUntil || null;
        
        this.saveData();
        this.showNotification('Settings updated successfully!', 'success');
    }

    updateBranding(event) {
        event.preventDefault();
        
        const companyName = document.getElementById('companyName').value.trim();
        const logoUrl = document.getElementById('logoUrl').value.trim();
        
        this.settings.companyName = companyName;
        this.settings.logoUrl = logoUrl;
        
        this.saveData();
        this.updateBrandingDisplay();
        this.showNotification('Branding updated successfully!', 'success');
    }

    toggleAppDisable() {
        this.settings.appDisabled = !this.settings.appDisabled;
        this.saveData();
        
        const buttonText = document.getElementById('disableButtonText');
        if (buttonText) {
            buttonText.textContent = this.settings.appDisabled ? 'Enable App' : 'Disable App';
        }
        
        this.showNotification(
            `Application ${this.settings.appDisabled ? 'disabled' : 'enabled'} successfully!`, 
            this.settings.appDisabled ? 'warning' : 'success'
        );
    }

    // Group Management
    showCreateGroup() {
        this.showModal('createGroupModal');
        this.loadUserCheckboxes();
    }

    loadUserCheckboxes() {
        const container = document.getElementById('userCheckboxes');
        if (!container) return;

        container.innerHTML = '';

        this.users.forEach(user => {
            if (user.id !== this.currentUser.id) {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'user-checkbox';
                
                checkboxDiv.innerHTML = `
                    <input type="checkbox" id="user_${user.id}" value="${user.id}">
                    <label for="user_${user.id}">${user.name} (${user.phoneNumber})</label>
                `;
                
                container.appendChild(checkboxDiv);
            }
        });
    }

    createGroup(event) {
        event.preventDefault();
        
        const groupName = document.getElementById('groupName').value.trim();
        const selectedUsers = Array.from(document.querySelectorAll('#userCheckboxes input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);
        
        if (!groupName) {
            this.showNotification('Please enter a group name', 'error');
            return;
        }
        
        if (selectedUsers.length === 0) {
            this.showNotification('Please select at least one member', 'error');
            return;
        }
        
        const newGroup = {
            id: 'group_' + Date.now(),
            name: groupName,
            members: [this.currentUser.id, ...selectedUsers],
            createdBy: this.currentUser.id,
            createdAt: new Date().toISOString()
        };
        
        this.groups.push(newGroup);
        this.saveData();
        
        // Add welcome message to group
        const welcomeMessage = {
            id: 'msg_' + Date.now() + '_welcome',
            sender: this.currentUser.id,
            receiver: newGroup.id,
            content: `Welcome to ${groupName}! 🎉`,
            timestamp: new Date().toISOString(),
            type: 'text',
            status: 'sent',
            mentions: []
        };
        
        this.messages.push(welcomeMessage);
        this.saveData();
        
        this.closeModal('createGroupModal');
        this.loadChatList();
        this.showNotification(`Group "${groupName}" created successfully!`, 'success');
        
        // Clear form
        document.getElementById('createGroupForm').reset();
    }

    // Chat Info
    showChatInfo() {
        if (!this.currentChat) return;
        
        const content = document.getElementById('chatInfoContent');
        if (!content) return;
        
        if (this.currentChat.type === 'group') {
            const memberNames = this.currentChat.members.map(memberId => {
                const user = this.users.find(u => u.id === memberId);
                return user ? user.name : 'Unknown User';
            }).join(', ');
            
            content.innerHTML = `
                <h4>${this.currentChat.name}</h4>
                <p><strong>Type:</strong> Group</p>
                <p><strong>Members (${this.currentChat.members.length}):</strong></p>
                <p>${memberNames}</p>
                <p><strong>Created:</strong> ${this.formatTime(this.currentChat.createdAt)}</p>
            `;
        } else {
            content.innerHTML = `
                <h4>${this.currentChat.name}</h4>
                <p><strong>Type:</strong> Direct Message</p>
                <p><strong>Phone:</strong> ${this.currentChat.phoneNumber}</p>
                <p><strong>Email:</strong> ${this.currentChat.email}</p>
                <p><strong>Status:</strong> ${this.currentChat.isOnline ? 'Online' : `Last seen ${this.formatTime(this.currentChat.lastSeen)}`}</p>
            `;
        }
        
        this.showModal('chatInfoModal');
    }

    // Notifications
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    // Heartbeat for online status simulation
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.currentUser) {
                this.currentUser.lastSeen = new Date().toISOString();
                this.saveData();
                
                // Simulate other users going online/offline randomly
                this.users.forEach(user => {
                    if (user.id !== this.currentUser.id) {
                        if (Math.random() < 0.1) { // 10% chance to change status
                            user.isOnline = !user.isOnline;
                            user.lastSeen = new Date().toISOString();
                        }
                    }
                });
                
                // Update chat list to reflect status changes
                if (this.currentChat && this.currentChat.type === 'user') {
                    const updatedUser = this.users.find(u => u.id === this.currentChat.id);
                    if (updatedUser) {
                        const chatStatus = document.getElementById('chatStatus');
                        if (chatStatus) {
                            chatStatus.textContent = updatedUser.isOnline ? 'Online' : `Last seen ${this.formatTime(updatedUser.lastSeen)}`;
                        }
                    }
                }
            }
        }, 30000); // Update every 30 seconds
    }

    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
}

// Initialize the app
const messagingApp = new MessagingApp();
