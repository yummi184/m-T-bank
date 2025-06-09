// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  // Login and Registration
  const loginContainer = document.getElementById("login-container")
  const registerContainer = document.getElementById("register-container")
  const dashboardContainer = document.getElementById("dashboard-container")
  const adminDashboard = document.getElementById("admin-dashboard")
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")
  const registerLink = document.getElementById("register-link")
  const loginLink = document.getElementById("login-link")
  const logoutBtn = document.getElementById("logout-btn")
  const adminLogoutBtn = document.getElementById("admin-logout-btn")

  // Sidebar
  const sidebar = document.getElementById("sidebar")
  const adminSidebar = document.getElementById("admin-sidebar")
  const menuToggle = document.querySelectorAll(".menu-toggle")
  const closeSidebar = document.querySelectorAll(".close-sidebar")

  // User Dashboard
  const sidebarMenuItems = document.querySelectorAll(".sidebar-menu li[data-page]")
  const navItems = document.querySelectorAll(".nav-item[data-page]")
  const pages = document.querySelectorAll(".page")
  const quickLinks = document.querySelectorAll(".link-item[data-page]")
  const wireTransferBtn = document.getElementById("wire-transfer-btn")
  const interBankBtn = document.getElementById("inter-bank-btn")
  const domesticTransferForm = document.getElementById("domestic-transfer-form")
  const interBankForm = document.getElementById("inter-bank-form")
  const wireTransferForm = document.getElementById("wire-transfer-form")
  const passwordForm = document.getElementById("password-form")
  const supportForm = document.getElementById("support-form")
  const calculateLoanBtn = document.getElementById("calculate-loan")

  // Admin Dashboard
  const adminSidebarMenuItems = document.querySelectorAll(".sidebar-menu li[data-admin-page]")
  const adminPages = document.querySelectorAll(".admin-page")
  const adminFundForm = document.getElementById("admin-fund-form")
  const addUserBtn = document.getElementById("add-user-btn")
  const addUserModal = document.getElementById("add-user-modal")
  const viewUserModal = document.getElementById("view-user-modal")
  const addUserForm = document.getElementById("add-user-form")
  const closeModal = document.querySelectorAll(".close-modal")

  // Dashboard Elements
  const username = document.getElementById("username")
  const userAvatar = document.getElementById("user-avatar")
  const profileInitial = document.getElementById("profile-initial")
  const currentTime = document.getElementById("current-time")
  const currentDate = document.getElementById("current-date")
  const balance = document.getElementById("balance")
  const accountNumber = document.getElementById("account-number")
  const accountStatus = document.getElementById("account-status")
  const transactionsBtn = document.getElementById("transactions-btn")
  const topupBtn = document.getElementById("topup-btn")
  const accountInfoBtn = document.getElementById("account-info-btn")
  const sendMoneyBtn = document.getElementById("send-money-btn")
  const depositBtn = document.getElementById("deposit-btn")
  const historyBtn = document.getElementById("history-btn")
  const applyCardBtn = document.querySelector(".apply-card-btn")
  const makeDepositBtn = document.querySelector(".make-deposit-btn")

  // Initialize data from server or create default if not exists
  let users = []
  let transactions = []

  // Fetch data from server
  let fetchData
  let checkLoggedInUser

  // Modify the fetchData function to ensure it updates the current user session after loading data
  fetchData = () => {
    return Promise.all([
      fetch("/api/users")
        .then((res) => res.json())
        .catch(() => null),
      fetch("/api/transactions")
        .then((res) => res.json())
        .catch(() => null),
    ])
      .then(([serverUsers, serverTransactions]) => {
        if (serverUsers) {
          users = serverUsers
          localStorage.setItem("users", JSON.stringify(users))

          // Update current user session if logged in
          const currentUser = getCurrentUser()
          if (currentUser) {
            const updatedUser = users.find((u) => u.id === currentUser.id)
            if (updatedUser) {
              sessionStorage.setItem("currentUser", JSON.stringify(updatedUser))
            }
          }
        } else {
          // Fallback to localStorage
          const storedUsers = localStorage.getItem("users")
          if (storedUsers) {
            users = JSON.parse(storedUsers)
          } else {
            // Create default admin user if no data exists
            users = [
              {
                id: 1,
                name: "Admin",
                email: "admin@grand.com",
                password: "admin123",
                balance: 5000000000.0,
                isAdmin: true,
                accountNumber: "1234567890",
                status: "active",
                createdAt: new Date().toISOString(),
              },
            ]
            localStorage.setItem("users", JSON.stringify(users))
          }
        }

        if (serverTransactions) {
          transactions = serverTransactions
          localStorage.setItem("transactions", JSON.stringify(transactions))
        } else {
          // Fallback to localStorage
          const storedTransactions = localStorage.getItem("transactions")
          if (storedTransactions) {
            transactions = JSON.parse(storedTransactions)
          } else {
            transactions = []
            localStorage.setItem("transactions", JSON.stringify(transactions))
          }
        }

        updateUI()
      })
      .catch((error) => {
        console.error("Error fetching data:", error)

        // Fallback to localStorage if server fetch fails
        const storedUsers = localStorage.getItem("users")
        const storedTransactions = localStorage.getItem("transactions")

        if (storedUsers) {
          users = JSON.parse(storedUsers)
        } else {
          // Create default admin user if no data exists
          users = [
            {
              id: 1,
              name: "Admin",
              email: "admin@grand.com",
              password: "admin123",
              balance: 5000000000.0,
              isAdmin: true,
              accountNumber: "1234567890",
              status: "active",
              createdAt: new Date().toISOString(),
            },
          ]
          localStorage.setItem("users", JSON.stringify(users))
        }

        if (storedTransactions) {
          transactions = JSON.parse(storedTransactions)
        } else {
          transactions = []
          localStorage.setItem("transactions", JSON.stringify(transactions))
        }

        updateUI()
      })
  }

  // Save data to local storage
  function saveData() {
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("transactions", JSON.stringify(transactions))

    // Also save to server
    fetch("/api/users/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users),
    }).catch((err) => console.error("Error saving users to server:", err))

    fetch("/api/transactions/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactions),
    }).catch((err) => console.error("Error saving transactions to server:", err))
  }

  // Update UI based on current data
  function updateUI() {
    const currentUser = getCurrentUser()

    if (currentUser) {
      updateDashboard(currentUser)
    }
  }

  // Get current logged in user
  function getCurrentUser() {
    const userJson = sessionStorage.getItem("currentUser")
    return userJson ? JSON.parse(userJson) : null
  }

  // Update dashboard with user data
  function updateDashboard(user) {
    // Update username and avatar
    if (username) username.textContent = user.name

    // Set initials for avatar
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    if (userAvatar) userAvatar.textContent = initials
    if (profileInitial) profileInitial.textContent = initials

    // Update balance with proper formatting
    if (balance) balance.textContent = formatCurrency(user.balance)

    // Update account number
    if (accountNumber) accountNumber.textContent = user.accountNumber

    // Update account status
    if (accountStatus) {
      accountStatus.textContent = "Active"
      accountStatus.className = "status-badge active"
    }

    // Update date and time
    updateDateTime()

    // Start time interval
    setInterval(updateDateTime, 1000)
  }

  // Update date and time
  function updateDateTime() {
    const now = new Date()

    // Format time as HH:MM:SS
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")
    const timeString = `${hours}:${minutes}:${seconds}`

    // Format date as Day DD Month YYYY
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const dateString = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`

    if (currentTime) currentTime.textContent = timeString
    if (currentDate) currentDate.textContent = dateString
  }

  // Event Listeners
  if (registerLink) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault()
      loginContainer.style.display = "none"
      registerContainer.style.display = "flex"
    })
  }

  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault()
      registerContainer.style.display = "none"
      loginContainer.style.display = "flex"
    })
  }

  // Modify the loginForm event listener to use the server API
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      // Try to login via API
      fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Login failed")
          }
          return response.json()
        })
        .then((user) => {
          loginSuccess(user)
        })
        .catch((error) => {
          console.error("Error logging in:", error)
          // If API fails, try local login
          const user = users.find((u) => u.email === email && u.password === password)

          if (user) {
            loginSuccess(user)
          } else {
            alert("Invalid email or password")
          }
        })
    })
  }

  function loginSuccess(user) {
    loginContainer.style.display = "none"

    // if (user.isAdmin) {
    //   adminDashboard.style.display = "flex"
    //   updateAdminDashboard()
    // } else {
    dashboardContainer.style.display = "flex"
    updateDashboard(user)
    // }

    // Store current user in session
    sessionStorage.setItem("currentUser", JSON.stringify(user))
  }

  // Modify the registerForm event listener to save to server
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const fullname = document.getElementById("fullname").value
      const email = document.getElementById("reg-email").value
      const password = document.getElementById("reg-password").value

      // Try to register via API
      fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: fullname, email, password }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Registration failed")
          }
          return response.json()
        })
        .then((user) => {
          // Add the new user to local users array
          users.push(user)
          localStorage.setItem("users", JSON.stringify(users))

          alert("Registration successful! Please login.")
          registerContainer.style.display = "none"
          loginContainer.style.display = "flex"
        })
        .catch((error) => {
          console.error("Error registering:", error)

          // Fallback to local registration if server is not available
          // Check if email already exists
          if (users.some((u) => u.email === email)) {
            alert("Email already registered")
            return
          }

          // Generate random account number
          const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000

          // Create new user
          const newUser = {
            id: users.length + 1,
            name: fullname,
            email: email,
            password: password,
            balance: 0,
            isAdmin: false,
            accountNumber: accountNumber.toString(),
            status: "active",
            createdAt: new Date().toISOString(),
          }

          users.push(newUser)
          saveData()

          // Switch to login
          registerContainer.style.display = "none"
          loginContainer.style.display = "flex"
          alert("Registration successful! Please login.")
        })
    })
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("currentUser")
      dashboardContainer.style.display = "none"
      loginContainer.style.display = "flex"
    })
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("currentUser")
      adminDashboard.style.display = "none"
      loginContainer.style.display = "flex"
    })
  }

  // Toggle sidebar
  menuToggle.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      sidebar.classList.add("active")
      adminSidebar.classList.add("active")
    })
  })

  closeSidebar.forEach((close) => {
    close.addEventListener("click", () => {
      sidebar.classList.remove("active")
      adminSidebar.classList.remove("active")
    })
  })

  // Page navigation
  function showPage(pageId) {
    pages.forEach((page) => {
      page.classList.remove("active")
    })

    const selectedPage = document.getElementById(pageId)
    if (selectedPage) {
      selectedPage.classList.add("active")
    }

    // Update navigation
    navItems.forEach((item) => {
      if (item.getAttribute("data-page") === pageId.replace("-page", "")) {
        item.classList.add("active")
      } else {
        item.classList.remove("active")
      }
    })
  }

  function showAdminPage(pageId) {
    adminPages.forEach((page) => {
      page.classList.remove("active")
    })

    const selectedPage = document.getElementById(pageId)
    if (selectedPage) {
      selectedPage.classList.add("active")
    }

    // Update navigation
    adminSidebarMenuItems.forEach((item) => {
      if (item.getAttribute("data-admin-page") === pageId.replace("-page", "")) {
        item.classList.add("active")
      } else {
        item.classList.remove("active")
      }
    })
  }

  sidebarMenuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const pageId = item.getAttribute("data-page") + "-page"
      showPage(pageId)
    })
  })

  adminSidebarMenuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const pageId = item.getAttribute("data-admin-page") + "-page"
      showAdminPage(pageId)
    })
  })

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const pageId = item.getAttribute("data-page") + "-page"
      showPage(pageId)
    })
  })

  quickLinks.forEach((item) => {
    item.addEventListener("click", () => {
      const pageId = item.getAttribute("data-page") + "-page"
      showPage(pageId)
    })
  })

  // Quick action buttons
  if (wireTransferBtn) {
    wireTransferBtn.addEventListener("click", () => {
      showPage("wire-transfer-page")
    })
  }

  if (interBankBtn) {
    interBankBtn.addEventListener("click", () => {
      showPage("inter-bank-page")
    })
  }

  // Transfer forms
  if (domesticTransferForm) {
    domesticTransferForm.addEventListener("submit", (e) => {
      e.preventDefault()
      processTransfer("domestic-recipient", "domestic-amount", "domestic-description")
    })
  }

  if (interBankForm) {
    interBankForm.addEventListener("submit", (e) => {
      e.preventDefault()
      processTransfer("bank-account", "bank-amount", "bank-description")
    })
  }

  if (wireTransferForm) {
    wireTransferForm.addEventListener("submit", (e) => {
      e.preventDefault()
      processTransfer("wire-recipient", "wire-amount", "wire-description")
    })
  }

  // Global variables for IMF verification
  let pendingTransferData = null
  let pendingAdminFundData = null

  // IMF verification modal elements
  const imfModal = document.getElementById("imf-verification-modal")
  const imfCodeInput = document.getElementById("imf-code-input")
  const confirmImfBtn = document.getElementById("confirm-imf-btn")
  const backDashboardBtn = document.getElementById("back-dashboard-btn")

  // Show IMF verification modal
  function showImfModal() {
    imfModal.classList.add("active")
    imfCodeInput.value = ""
    imfCodeInput.focus()
  }

  // Hide IMF verification modal
  function hideImfModal() {
    imfModal.classList.remove("active")
    // Don't clear pending data here - let the execution functions handle it
  }

  // IMF verification event listeners
  if (confirmImfBtn) {
    confirmImfBtn.addEventListener("click", () => {
      const enteredCode = imfCodeInput.value.trim().toUpperCase()

      if (enteredCode === "IMF CODE") {
        // Process pending transfer immediately
        if (pendingTransferData) {
          executeTransfer(pendingTransferData)
          hideImfModal()
          // Clear pending data
          pendingTransferData = null
        }

        // Process pending admin funding
        if (pendingAdminFundData) {
          executeAdminFunding(pendingAdminFundData)
          hideImfModal()
          // Clear pending data
          pendingAdminFundData = null
        }
      } else {
        alert("Invalid IMF code. Please enter the correct code to proceed.")
        imfCodeInput.focus()
      }
    })
  }

  if (backDashboardBtn) {
    backDashboardBtn.addEventListener("click", () => {
      hideImfModal()
      showPage("dashboard-page")
    })
  }

  // Close modal when clicking outside
  imfModal.addEventListener("click", (e) => {
    if (e.target === imfModal) {
      hideImfModal()
    }
  })

  // Allow Enter key to confirm IMF code
  if (imfCodeInput) {
    imfCodeInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        confirmImfBtn.click()
      }
    })
  }

  // Updated processTransfer function with IMF verification
  function processTransfer(recipientField, amountField, descriptionField) {
    const recipient = document.getElementById(recipientField).value
    const amount = Number.parseFloat(document.getElementById(amountField).value)
    const description = document.getElementById(descriptionField).value || "Transfer"

    // Get current user
    const currentUser = getCurrentUser()

    if (!currentUser) {
      alert("You must be logged in to make a transfer")
      return
    }

    if (!recipient || !amount || amount <= 0) {
      alert("Please fill in all required fields with valid values")
      return
    }

    if (currentUser.balance < amount) {
      alert("Insufficient funds")
      return
    }

    // Store transfer data for after IMF verification
    pendingTransferData = {
      recipient,
      amount,
      description,
      recipientField,
      amountField,
      descriptionField,
    }

    // Show IMF verification modal
    showImfModal()
  }

  // Execute transfer after IMF verification
  function executeTransfer(transferData) {
    const { recipient, amount, description, recipientField, amountField, descriptionField } = transferData

    // Get current user
    const currentUser = getCurrentUser()

    // Find recipient (by email or account number) from current users array
    const recipientUser = users.find((u) => u.email === recipient || u.accountNumber === recipient)

    if (!recipientUser) {
      alert("Recipient not found")
      return
    }

    if (currentUser.balance < amount) {
      alert("Insufficient funds")
      return
    }

    // Update balances
    const currentUserIndex = users.findIndex((u) => u.id === currentUser.id)
    const recipientIndex = users.findIndex((u) => u.id === recipientUser.id)

    users[currentUserIndex].balance -= amount
    users[recipientIndex].balance += amount

    // Create transaction records
    const timestamp = new Date().toISOString()
    const referenceNumber = `TRF-${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")}`

    // Debit transaction for sender
    const debitTransaction = {
      id: transactions.length + 1,
      from: currentUser.email,
      fromAccount: currentUser.accountNumber,
      to: recipientUser.email,
      toAccount: recipientUser.accountNumber,
      amount: amount,
      type: "debit",
      description: description,
      timestamp: timestamp,
      status: "completed",
      reference: referenceNumber,
    }

    // Credit transaction for recipient
    const creditTransaction = {
      id: transactions.length + 2,
      from: currentUser.email,
      fromAccount: currentUser.accountNumber,
      to: recipientUser.email,
      toAccount: recipientUser.accountNumber,
      amount: amount,
      type: "credit",
      description: description,
      timestamp: timestamp,
      status: "completed",
      reference: referenceNumber,
    }

    transactions.push(debitTransaction, creditTransaction)

    // Update session storage
    sessionStorage.setItem("currentUser", JSON.stringify(users[currentUserIndex]))

    // Save data
    saveData()

    // Update UI immediately
    updateDashboard(users[currentUserIndex])

    // Show receipt modal with proper details
    showReceiptModal({
      recipient: recipientUser.name,
      recipientAccount: recipientUser.accountNumber,
      amount: amount,
      description: description || "Transfer",
      date: new Date().toLocaleString(),
      reference: referenceNumber,
    })

    // Clear form
    document.getElementById(recipientField).value = ""
    document.getElementById(amountField).value = ""
    document.getElementById(descriptionField).value = ""
  }

  // Add this new function to ensure the receipt modal is displayed correctly
  function displayReceiptModal(data) {
    console.log("Displaying receipt modal with data:", data)

    const receiptModal = document.getElementById("receipt-modal")
    const receiptAmount = document.getElementById("receipt-amount")
    const receiptRecipient = document.getElementById("receipt-recipient")
    const receiptAccount = document.getElementById("receipt-account")
    const receiptDescription = document.getElementById("receipt-description")
    const receiptDate = document.getElementById("receipt-date")
    const receiptReference = document.getElementById("receipt-reference")

    if (!receiptModal) {
      console.error("Receipt modal element not found!")
      return
    }

    // Fill in receipt details
    if (receiptAmount) receiptAmount.textContent = formatCurrency(data.amount)
    if (receiptRecipient) receiptRecipient.textContent = data.recipient
    if (receiptAccount) receiptAccount.textContent = data.recipientAccount
    if (receiptDescription) receiptDescription.textContent = data.description || "Transfer"
    if (receiptDate) receiptDate.textContent = data.date
    if (receiptReference) receiptReference.textContent = data.reference

    // Show the modal
    receiptModal.classList.add("active")
    receiptModal.style.display = "flex"

    // Add event listeners for receipt modal buttons
    const closeReceiptBtn = document.getElementById("close-receipt-btn")
    const shareReceiptBtn = document.getElementById("share-receipt-btn")
    const closeModalBtn = receiptModal.querySelector(".close-modal")

    // Close receipt button
    if (closeReceiptBtn) {
      closeReceiptBtn.onclick = () => {
        receiptModal.classList.remove("active")
        receiptModal.style.display = "none"
      }
    }

    // Share receipt button
    if (shareReceiptBtn) {
      shareReceiptBtn.onclick = () => {
        const receiptText = `
M&T BANK TRANSFER RECEIPT
------------------------
✅ Transfer Successful
Amount: ${formatCurrency(data.amount)}
Recipient: ${data.recipient}
Account: ${data.recipientAccount}
Description: ${data.description || "Transfer"}
Date: ${data.date}
Reference: ${data.reference}
------------------------
Thank you for banking with M&T BANK!
            `

        if (navigator.share) {
          navigator
            .share({
              title: "M&T BANK Transfer Receipt",
              text: receiptText,
            })
            .catch(() => {
              copyToClipboard(receiptText)
            })
        } else {
          copyToClipboard(receiptText)
        }
      }
    }

    // Close modal X button
    if (closeModalBtn) {
      closeModalBtn.onclick = () => {
        receiptModal.classList.remove("active")
        receiptModal.style.display = "none"
      }
    }

    // Close when clicking outside
    receiptModal.onclick = (e) => {
      if (e.target === receiptModal) {
        receiptModal.classList.remove("active")
        receiptModal.style.display = "none"
      }
    }
  }

  // Update the IMF verification event listener to use the new function
  if (confirmImfBtn) {
    confirmImfBtn.addEventListener("click", () => {
      const enteredCode = imfCodeInput.value.trim().toUpperCase()

      if (enteredCode === "IMF CODE") {
        // Process pending transfer immediately
        if (pendingTransferData) {
          executeTransfer(pendingTransferData)
          hideImfModal()
          // Clear pending data
          pendingTransferData = null
        }

        // Process pending admin funding
        if (pendingAdminFundData) {
          executeAdminFunding(pendingAdminFundData)
          hideImfModal()
          // Clear pending data
          pendingAdminFundData = null
        }
      } else {
        alert("Invalid IMF code. Please enter the correct code to proceed.")
        imfCodeInput.focus()
      }
    })
  }

  // Update admin fund form with IMF verification
  if (adminFundForm) {
    adminFundForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const userIdentifier = document.getElementById("fund-user-email").value
      const amount = Number.parseFloat(document.getElementById("fund-amount").value)
      const description = document.getElementById("fund-description").value || "Admin Funding"

      // Get admin user
      const admin = getCurrentUser()

      if (!admin || !admin.isAdmin) {
        alert("Unauthorized")
        return
      }

      if (!userIdentifier || !amount || amount <= 0) {
        alert("Please fill in all required fields with valid values")
        return
      }

      if (admin.balance < amount) {
        alert("Insufficient admin funds")
        return
      }

      // Store admin funding data for after IMF verification
      pendingAdminFundData = {
        userIdentifier,
        amount,
        description,
      }

      // Show IMF verification modal
      showImfModal()
    })
  }

  // Execute admin funding after IMF verification
  function executeAdminFunding(fundData) {
    const { userIdentifier, amount, description } = fundData

    // Get admin user
    const admin = getCurrentUser()

    // Find user to fund (by email or account number)
    const userToFund = users.find((u) => u.email === userIdentifier || u.accountNumber === userIdentifier)

    if (!userToFund) {
      alert("User not found")
      return
    }

    if (admin.balance < amount) {
      alert("Insufficient admin funds")
      return
    }

    // Update balances
    const adminIndex = users.findIndex((u) => u.id === admin.id)
    const userIndex = users.findIndex((u) => u.id === userToFund.id)

    users[adminIndex].balance -= amount
    users[userIndex].balance += amount

    // Create transaction records
    const timestamp = new Date().toISOString()

    // Debit transaction for admin
    const debitTransaction = {
      id: transactions.length + 1,
      from: admin.email,
      fromAccount: admin.accountNumber,
      to: userToFund.email,
      toAccount: userToFund.accountNumber,
      amount: amount,
      type: "debit",
      description: description,
      timestamp: timestamp,
      status: "completed",
    }

    // Credit transaction for user
    const creditTransaction = {
      id: transactions.length + 2,
      from: admin.email,
      fromAccount: admin.accountNumber,
      to: userToFund.email,
      toAccount: userToFund.accountNumber,
      amount: amount,
      type: "credit",
      description: description,
      timestamp: timestamp,
      status: "completed",
    }

    transactions.push(debitTransaction, creditTransaction)

    // Update session storage
    sessionStorage.setItem("currentUser", JSON.stringify(users[adminIndex]))

    // Save data
    saveData()

    // Update dashboard
    updateAdminDashboard()

    alert("User funded successfully")

    // Reset form
    adminFundForm.reset()
  }

  // Add user modal
  if (addUserBtn) {
    addUserBtn.addEventListener("click", () => {
      addUserModal.classList.add("active")
    })
  }

  // Close modals
  closeModal.forEach((close) => {
    close.addEventListener("click", () => {
      addUserModal.classList.remove("active")
      viewUserModal.classList.remove("active")
    })
  })

  // Add user form
  if (addUserForm) {
    addUserForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const name = document.getElementById("add-user-name").value
      const email = document.getElementById("add-user-email").value
      const password = document.getElementById("add-user-password").value
      const balance = Number.parseFloat(document.getElementById("add-user-balance").value) || 0

      // Check if email already exists
      if (users.some((u) => u.email === email)) {
        alert("Email already registered")
        return
      }

      // Generate random account number
      const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000

      // Create new user
      const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password,
        balance: balance,
        isAdmin: false,
        accountNumber: accountNumber.toString(),
        status: "active",
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)

      // If admin added initial balance, create a transaction
      if (balance > 0) {
        const admin = getCurrentUser()

        if (admin && admin.isAdmin) {
          const timestamp = new Date().toISOString()

          // Debit transaction for admin
          const debitTransaction = {
            id: transactions.length + 1,
            from: admin.email,
            fromAccount: admin.accountNumber,
            to: newUser.email,
            toAccount: newUser.accountNumber,
            amount: balance,
            type: "debit",
            description: "Initial funding",
            timestamp: timestamp,
            status: "completed",
          }

          // Credit transaction for user
          const creditTransaction = {
            id: transactions.length + 2,
            from: admin.email,
            fromAccount: admin.accountNumber,
            to: newUser.email,
            toAccount: newUser.accountNumber,
            amount: balance,
            type: "credit",
            description: "Initial funding",
            timestamp: timestamp,
            status: "completed",
          }

          transactions.push(debitTransaction, creditTransaction)

          // Update admin balance
          const adminIndex = users.findIndex((u) => u.id === admin.id)
          users[adminIndex].balance -= balance

          // Update session storage
          sessionStorage.setItem("currentUser", JSON.stringify(users[adminIndex]))
        }
      }

      // Save data
      saveData()

      // Show receipt modal with proper details
      showReceiptModal({
        recipient: name,
        recipientAccount: accountNumber.toString(),
        amount: balance,
        description: "Initial funding",
        date: new Date().toLocaleString(),
        reference: "N/A",
      })

      // Reset form fields
      addUserForm.reset()

      // Update dashboard
      updateAdminDashboard()

      // Close modal
      addUserModal.classList.remove("active")

      alert("User added successfully")
    })
  }

  // Update user dashboard
  function updateUserDashboard(user) {
    // Update balance
    document.getElementById("balance").textContent = formatCurrency(user.balance)
    document.getElementById("ledger-balance").textContent = formatCurrency(user.balance)
    document.getElementById("sidebar-balance").textContent = formatCurrency(user.balance)

    // Update username
    document.getElementById("username").textContent = user.name
    document.getElementById("sidebar-username").textContent = user.name

    // Update account number
    document.getElementById("sidebar-account-number").textContent = `Acc No: ${user.accountNumber}`

    // Update profile page
    document.getElementById("profile-name").textContent = user.name
    document.getElementById("profile-account-number").textContent = user.accountNumber
    document.getElementById("profile-fullname").textContent = user.name
    document.getElementById("profile-email").textContent = user.email
    document.getElementById("profile-date").textContent = formatDate(user.createdAt)

    // Update card holder name
    if (document.getElementById("card-holder-name")) {
      document.getElementById("card-holder-name").textContent = user.name
    }

    // Update transactions
    updateTransactions(user)

    // Update statement
    updateStatement(user)

    // Update history
    updateHistory(user)
  }

  // Update admin dashboard
  function updateAdminDashboard() {
    const admin = getCurrentUser()

    if (!admin || !admin.isAdmin) {
      return
    }

    // Update admin balance
    document.getElementById("admin-balance").textContent = formatCurrency(admin.balance)

    // Update stats
    const nonAdminUsers = users.filter((u) => !u.isAdmin)
    document.getElementById("total-users").textContent = nonAdminUsers.length
    document.getElementById("total-transactions").textContent = transactions.length

    const transfers = transactions.filter((t) => t.type === "debit" && t.from !== "admin@safenest.com")
    document.getElementById("total-transfers").textContent = transfers.length

    const adminFunding = transactions.filter((t) => t.type === "debit" && t.from === "admin@safenest.com")
    const totalFunded = adminFunding.reduce((sum, t) => sum + t.amount, 0)
    document.getElementById("total-funds").textContent = formatCurrency(totalFunded)

    // Update recent users table
    const recentUsersTable = document.getElementById("recent-users-table")
    if (recentUsersTable) {
      recentUsersTable.innerHTML = ""

      nonAdminUsers.slice(0, 5).forEach((user) => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.accountNumber}</td>
                <td>${formatCurrency(user.balance)}</td>
                <td><span class="status ${user.status}">${user.status}</span></td>
                <td>
                    <div class="user-actions">
                        <button class="action-btn fund-btn-small" data-email="${user.email}">Fund</button>
                        <button class="action-btn view-btn" data-id="${user.id}">View</button>
                    </div>
                </td>
            `
        recentUsersTable.appendChild(tr)
      })

      // Add event listeners to buttons
      addUserActionListeners()
    }

    // Update recent transactions table
    const recentTransactionsTable = document.getElementById("recent-transactions-table")
    if (recentTransactionsTable) {
      recentTransactionsTable.innerHTML = ""

      transactions.slice(0, 5).forEach((transaction) => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
                <td>${formatDate(transaction.timestamp)}</td>
                <td>${transaction.from}</td>
                <td>${transaction.to}</td>
                <td>${formatCurrency(transaction.amount)}</td>
                <td>${transaction.type}</td>
                <td><span class="status ${transaction.status}">${transaction.status}</span></td>
            `
        recentTransactionsTable.appendChild(tr)
      })
    }

    // Update users table
    const usersTableBody = document.getElementById("users-table-body")
    if (usersTableBody) {
      usersTableBody.innerHTML = ""

      nonAdminUsers.forEach((user) => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.accountNumber}</td>
                <td>${formatCurrency(user.balance)}</td>
                <td><span class="status ${user.status}">${user.status}</span></td>
                <td>
                    <div class="user-actions">
                        <button class="action-btn fund-btn-small" data-email="${user.email}">Fund</button>
                        <button class="action-btn view-btn" data-id="${user.id}">View</button>
                        <button class="action-btn edit-btn" data-id="${user.id}">Edit</button>
                        <button class="action-btn delete-btn" data-id="${user.id}">Delete</button>
                    </div>
                </td>
            `
        usersTableBody.appendChild(tr)
      })

      // Add event listeners to buttons
      addUserActionListeners()
    }

    // Update funding transactions table
    const fundingTransactionsTable = document.getElementById("funding-transactions-table")
    if (fundingTransactionsTable) {
      fundingTransactionsTable.innerHTML = ""

      adminFunding.slice(0, 5).forEach((transaction) => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
                <td>${formatDate(transaction.timestamp)}</td>
                <td>${transaction.to}</td>
                <td>${formatCurrency(transaction.amount)}</td>
                <td>${transaction.description}</td>
                <td><span class="status ${transaction.status}">${transaction.status}</span></td>
            `
        fundingTransactionsTable.appendChild(tr)
      })
    }

    // Update all transactions table
    const transactionsTableBody = document.getElementById("transactions-table-body")
    if (transactionsTableBody) {
      transactionsTableBody.innerHTML = ""

      transactions.forEach((transaction) => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
                <td>${formatDate(transaction.timestamp)}</td>
                <td>${transaction.from}</td>
                <td>${transaction.to}</td>
                <td>${formatCurrency(transaction.amount)}</td>
                <td>${transaction.type}</td>
                <td>${transaction.description}</td>
                <td><span class="status ${transaction.status}">${transaction.status}</span></td>
            `
        transactionsTableBody.appendChild(tr)
      })
    }
  }

  // Add event listeners to user action buttons
  function addUserActionListeners() {
    // Fund buttons
    document.querySelectorAll(".fund-btn-small").forEach((btn) => {
      btn.addEventListener("click", () => {
        const email = btn.getAttribute("data-email")
        document.getElementById("fund-user-email").value = email
        showAdminPage("admin-fund-page")
      })
    })

    // View buttons
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const userId = Number.parseInt(btn.getAttribute("data-id"))
        const user = users.find((u) => u.id === userId)

        if (user) {
          document.getElementById("view-user-name").textContent = user.name
          document.getElementById("view-user-email").textContent = user.email
          document.getElementById("view-user-account").textContent = user.accountNumber
          document.getElementById("view-user-balance").textContent = formatCurrency(user.balance)
          document.getElementById("view-user-status").textContent = user.status
          document.getElementById("view-user-date").textContent = formatDate(user.createdAt)

          // Set button text based on status
          const toggleStatusBtn = document.querySelector(".toggle-status-btn")
          toggleStatusBtn.textContent = user.status === "active" ? "Deactivate" : "Activate"

          // Add event listeners to buttons
          document.querySelector(".edit-user-btn").setAttribute("data-id", user.id)
          document.querySelector(".fund-user-btn").setAttribute("data-email", user.email)
          document.querySelector(".toggle-status-btn").setAttribute("data-id", user.id)

          viewUserModal.classList.add("active")
        }
      })
    })

    // Edit buttons
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const userId = Number.parseInt(btn.getAttribute("data-id"))
        const user = users.find((u) => u.id === userId)

        if (user) {
          // Populate form
          document.getElementById("add-user-name").value = user.name
          document.getElementById("add-user-email").value = user.email
          document.getElementById("add-user-password").value = user.password
          document.getElementById("add-user-balance").value = user.balance

          // Change form submission behavior
          const addUserForm = document.getElementById("add-user-form")
          addUserForm.setAttribute("data-edit-id", user.id)

          // Change button text
          document.querySelector(".add-user-btn").textContent = "Update User"

          addUserModal.classList.add("active")
        }
      })
    })

    // Delete buttons
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const userId = Number.parseInt(btn.getAttribute("data-id"))

        if (confirm("Are you sure you want to delete this user?")) {
          // Remove user
          users = users.filter((u) => u.id !== userId)

          // Save data
          saveData()

          // Update dashboard
          updateAdminDashboard()

          alert("User deleted successfully")
        }
      })
    })
  }

  // Update transactions in user dashboard
  function updateTransactions(user) {
    const creditTransactions = document.getElementById("credit-transactions")
    const debitTransactions = document.getElementById("debit-transactions")

    if (!creditTransactions || !debitTransactions) return

    creditTransactions.innerHTML = ""
    debitTransactions.innerHTML = ""

    // Get user's transactions
    const userCredits = transactions.filter((t) => t.to === user.email && t.type === "credit")
    const userDebits = transactions.filter((t) => t.from === user.email && t.type === "debit")

    // Display credit transactions
    if (userCredits.length === 0) {
      creditTransactions.innerHTML = '<div class="transaction-item"><p>No credit transactions</p></div>'
    } else {
      userCredits.slice(0, 3).forEach((transaction) => {
        const div = document.createElement("div")
        div.className = "transaction-item"
        div.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-icon">
                        <i class="fas fa-history"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.from === "admin@safenest.com" ? "Admin" : transaction.from}</h4>
                        <span class="transaction-status credited">Credited</span>
                    </div>
                </div>
                <div class="transaction-amount credit">${formatCurrency(transaction.amount)}</div>
            `
        creditTransactions.appendChild(div)
      })
    }

    // Display debit transactions
    if (userDebits.length === 0) {
      debitTransactions.innerHTML = '<div class="transaction-item"><p>No debit transactions</p></div>'
    } else {
      userDebits.slice(0, 3).forEach((transaction) => {
        const div = document.createElement("div")
        div.className = "transaction-item"
        div.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-icon">
                        <i class="fas fa-history"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.to}</h4>
                        <span class="transaction-status processing">Processing</span>
                    </div>
                </div>
                <div class="transaction-amount debit">-${formatCurrency(transaction.amount)}</div>
            `
        debitTransactions.appendChild(div)
      })
    }
  }

  // Update statement
  function updateStatement(user) {
    const statementTableBody = document.getElementById("statement-table-body")

    if (!statementTableBody) return

    statementTableBody.innerHTML = ""

    // Get user's transactions
    const userTransactions = transactions.filter((t) => t.to === user.email || t.from === user.email)

    // Sort by date (newest first)
    userTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    let balance = user.balance

    // Display transactions in reverse order (oldest first)
    userTransactions.reverse().forEach((transaction) => {
      const isCredit = transaction.to === user.email
      const amount = isCredit ? transaction.amount : -transaction.amount

      // Calculate running balance
      if (!isCredit) {
        balance -= transaction.amount
      } else {
        balance += transaction.amount
      }

      const tr = document.createElement("tr")
      tr.innerHTML = `
            <td>${formatDate(transaction.timestamp)}</td>
            <td>${transaction.description}</td>
            <td>${isCredit ? formatCurrency(transaction.amount) : "-" + formatCurrency(transaction.amount)}</td>
            <td>${isCredit ? "Credit" : "Debit"}</td>
            <td>${formatCurrency(balance)}</td>
        `
      statementTableBody.appendChild(tr)
    })
  }

  // Update history
  function updateHistory(user) {
    const historyTableBody = document.getElementById("history-table-body")

    if (!historyTableBody) return

    historyTableBody.innerHTML = ""

    // Get user's transactions
    const userTransactions = transactions.filter((t) => t.to === user.email || t.from === user.email)

    // Sort by date (newest first)
    userTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    userTransactions.forEach((transaction) => {
      const isCredit = transaction.to === user.email

      const tr = document.createElement("tr")
      tr.innerHTML = `
            <td>${formatDate(transaction.timestamp)}</td>
            <td>${transaction.description}</td>
            <td>${isCredit ? formatCurrency(transaction.amount) : "-" + formatCurrency(transaction.amount)}</td>
            <td>${isCredit ? "Credit" : "Debit"}</td>
            <td><span class="status ${transaction.status}">${transaction.status}</span></td>
        `
      historyTableBody.appendChild(tr)
    })
  }

  // Fix the formatCurrency function to ensure it includes commas
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  // Check if user is logged in (page refresh)
  checkLoggedInUser = () => {
    const currentUser = getCurrentUser()

    if (currentUser) {
      // User is logged in, hide login/register and show dashboard
      if (loginContainer) loginContainer.style.display = "none"
      if (registerContainer) registerContainer.style.display = "none"

      if (currentUser.isAdmin) {
        if (adminDashboard) {
          adminDashboard.style.display = "flex"
          updateAdminDashboard()
        }
        if (dashboardContainer) dashboardContainer.style.display = "none"
      } else {
        if (dashboardContainer) {
          dashboardContainer.style.display = "flex"
          updateDashboard(currentUser)
        }
        if (adminDashboard) adminDashboard.style.display = "none"
      }
    } else {
      // No user logged in, show login container
      if (loginContainer) loginContainer.style.display = "flex"
      if (registerContainer) registerContainer.style.display = "none"
      if (dashboardContainer) dashboardContainer.style.display = "none"
      if (adminDashboard) adminDashboard.style.display = "none"
    }
  }

  // Initialize the application
  function initializeApp() {
    // Ensure only dashboard page is visible initially for user
    const userPages = document.querySelectorAll(".page")
    userPages.forEach((page) => {
      page.classList.remove("active")
    })

    const dashboardPage = document.getElementById("dashboard-page")
    if (dashboardPage) {
      dashboardPage.classList.add("active")
    }

    // Ensure only dashboard page is visible initially for admin
    const adminPagesElements = document.querySelectorAll(".admin-page")
    adminPagesElements.forEach((page) => {
      page.classList.remove("active")
    })
    const adminDashboardPage = document.getElementById("admin-dashboard-page")
    if (adminDashboardPage) {
      adminDashboardPage.classList.add("active")
    }

    // Load data first, then check login status
    fetchData()
      .then(() => {
        checkLoggedInUser()
      })
      .catch(() => {
        // If fetchData fails, still check login status
        checkLoggedInUser()
      })
  }

  // Action buttons
  if (transactionsBtn) {
    transactionsBtn.addEventListener("click", () => {
      showPage("history-page")
    })
  }

  if (topupBtn) {
    topupBtn.addEventListener("click", () => {
      showPage("deposit-page")
    })
  }

  if (accountInfoBtn) {
    accountInfoBtn.addEventListener("click", () => {
      showPage("profile-page")
    })
  }

  if (sendMoneyBtn) {
    sendMoneyBtn.addEventListener("click", () => {
      showPage("domestic-transfer-page")
    })
  }

  if (depositBtn) {
    depositBtn.addEventListener("click", () => {
      showPage("deposit-page")
    })
  }

  if (historyBtn) {
    historyBtn.addEventListener("click", () => {
      showPage("history-page")
    })
  }

  if (applyCardBtn) {
    applyCardBtn.addEventListener("click", () => {
      alert("Card application submitted! We'll process your request shortly.")
    })
  }

  if (makeDepositBtn) {
    makeDepositBtn.addEventListener("click", () => {
      showPage("deposit-page")
    })
  }

  // Sidebar functionality
  const menuToggleClick = document.querySelector(".menu-toggle")
  const sidebarElement = document.getElementById("sidebar")
  const closeSidebarClick = document.querySelector(".close-sidebar")
  const sidebarMenuItemsList = document.querySelectorAll(".sidebar-menu-item")

  if (menuToggleClick) {
    menuToggleClick.addEventListener("click", () => {
      sidebarElement.classList.add("active")
    })
  }

  if (closeSidebarClick) {
    closeSidebarClick.addEventListener("click", () => {
      sidebarElement.classList.remove("active")
    })
  }

  // Sidebar navigation
  sidebarMenuItemsList.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove active class from all items
      sidebarMenuItemsList.forEach((i) => i.classList.remove("active"))

      // Add active class to clicked item
      item.classList.add("active")

      // If it's the logout button, handle logout
      if (item.id === "logout-btn") {
        sessionStorage.removeItem("currentUser")
        window.location.reload()
        return
      }

      // Otherwise, navigate to the page
      const pageId = item.getAttribute("data-page") + "-page"
      showPage(pageId)

      // Close sidebar on mobile
      if (window.innerWidth < 1024) {
        sidebarElement.classList.remove("active")
      }
    })
  })

  // Deposit page functionality
  const methodOptions = document.querySelectorAll(".method-option")
  const cardDetails = document.getElementById("card-details")
  const bankDetails = document.getElementById("bank-details")
  const cryptoDetails = document.getElementById("crypto-details")
  const depositFormElement = document.getElementById("deposit-form")
  const depositSubmitBtn = document.getElementById("deposit-submit-btn")
  const noDeposits = document.getElementById("no-deposits")
  const depositsList = document.getElementById("deposits-list")
  const bankAccountName = document.getElementById("bank-account-name")
  const bankReference = document.getElementById("bank-reference")

  // Update bank details with user info
  function updateBankDetails() {
    const currentUser = getCurrentUser()
    if (currentUser && bankAccountName) {
      bankAccountName.textContent = currentUser.name
      bankReference.textContent = `DEP-${currentUser.accountNumber}`
    }
  }

  // Method selection
  if (methodOptions) {
    methodOptions.forEach((option) => {
      option.addEventListener("click", () => {
        // Remove active class from all options
        methodOptions.forEach((opt) => opt.classList.remove("active"))

        // Add active class to clicked option
        option.classList.add("active")

        // Show/hide relevant details
        const method = option.getAttribute("data-method")

        if (method === "card") {
          cardDetails.style.display = "block"
          bankDetails.style.display = "none"
          cryptoDetails.style.display = "none"
          depositSubmitBtn.textContent = "Deposit Now"
        } else if (method === "bank") {
          cardDetails.style.display = "none"
          bankDetails.style.display = "block"
          cryptoDetails.style.display = "none"
          depositSubmitBtn.textContent = "I've Made the Transfer"
          updateBankDetails()
        } else if (method === "crypto") {
          cardDetails.style.display = "none"
          bankDetails.style.display = "none"
          cryptoDetails.style.display = "block"
          depositSubmitBtn.textContent = "I've Sent the Crypto"
        }
      })
    })
  }

  // Deposit form submission
  if (depositFormElement) {
    depositFormElement.addEventListener("submit", (e) => {
      e.preventDefault()

      const amount = Number.parseFloat(document.getElementById("deposit-amount").value)
      const activeMethod = document.querySelector(".method-option.active")
      const method = activeMethod ? activeMethod.getAttribute("data-method") : "card"

      // Get current user
      const currentUser = getCurrentUser()

      if (!currentUser) {
        alert("You must be logged in to make a deposit")
        return
      }

      // Update user balance
      const userIndex = users.findIndex((u) => u.id === currentUser.id)
      users[userIndex].balance += amount

      // Create transaction record
      const timestamp = new Date().toISOString()

      // Credit transaction for user
      const creditTransaction = {
        id: transactions.length + 1,
        from: method === "card" ? "Card Deposit" : method === "bank" ? "Bank Transfer" : "Crypto Deposit",
        fromAccount: "DEPOSIT",
        to: currentUser.email,
        toAccount: currentUser.accountNumber,
        amount: amount,
        type: "credit",
        description: `Deposit via ${method === "card" ? "Card" : method === "bank" ? "Bank Transfer" : "Cryptocurrency"}`,
        timestamp: timestamp,
        status: "completed",
      }

      transactions.push(creditTransaction)

      // Update session storage
      sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))

      // Save data
      saveData()

      // Update UI
      updateDashboard(users[userIndex])

      // Show success message
      showComingSoonModal(
        "Deposit Successful",
        `Your account has been credited with $${amount}. It may take a few moments to reflect in your balance.`,
      )

      // Reset form
      depositFormElement.reset()
    })
  }

  // Copy button for crypto address
  const copyBtn = document.querySelector(".copy-btn")
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const cryptoAddress = document.querySelector(".address-copy code").textContent
      navigator.clipboard.writeText(cryptoAddress).then(() => {
        copyBtn.innerHTML = '<i class="fas fa-check"></i>'
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="far fa-copy"></i>'
        }, 2000)
      })
    })
  }

  // Profile page functionality
  const passwordFormElement = document.getElementById("password-form")

  if (passwordFormElement) {
    passwordFormElement.addEventListener("submit", (e) => {
      e.preventDefault()

      const currentPassword = document.getElementById("current-password").value
      const newPassword = document.getElementById("new-password").value
      const confirmPassword = document.getElementById("confirm-password").value

      const currentUser = getCurrentUser()

      if (!currentUser) {
        alert("You must be logged in to change your password")
        return
      }

      if (currentUser.password !== currentPassword) {
        alert("Current password is incorrect")
        return
      }

      if (newPassword !== confirmPassword) {
        alert("New passwords do not match")
        return
      }

      // Update password
      const userIndex = users.findIndex((u) => u.id === currentUser.id)
      users[userIndex].password = newPassword

      // Update session storage
      sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))

      // Save data
      saveData()

      alert("Password changed successfully")

      // Reset form
      passwordFormElement.reset()
    })
  }

  // Update profile page with user data
  function updateProfilePage(user) {
    if (!user) return

    const profileName = document.getElementById("profile-name")
    const profileAccountNumber = document.getElementById("profile-account-number")
    const profileFullname = document.getElementById("profile-fullname")
    const profileEmail = document.getElementById("profile-email")
    const profileDate = document.getElementById("profile-date")
    const profilePageAvatar = document.getElementById("profile-page-avatar")

    if (profileName) profileName.textContent = user.name
    if (profileAccountNumber) profileAccountNumber.textContent = user.accountNumber
    if (profileFullname) profileFullname.textContent = user.name
    if (profileEmail) profileEmail.textContent = user.email
    if (profileDate) profileDate.textContent = formatDate(user.createdAt)

    // Set avatar initials
    if (profilePageAvatar) {
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
      profilePageAvatar.innerHTML = `<i class="fas fa-user"></i>`
    }
  }

  // Update the updateSidebar function to properly format the balance
  function updateSidebar(user) {
    if (!user) return

    const sidebarUsername = document.getElementById("sidebar-username")
    const sidebarAccountNumber = document.getElementById("sidebar-account-number")
    const sidebarBalance = document.getElementById("sidebar-balance")
    const sidebarAvatar = document.getElementById("sidebar-avatar")

    if (sidebarUsername) sidebarUsername.textContent = user.name
    if (sidebarAccountNumber) sidebarAccountNumber.textContent = `Acc No: ${user.accountNumber}`
    if (sidebarBalance) sidebarBalance.textContent = formatCurrency(user.balance)

    // Set avatar initials
    if (sidebarAvatar) {
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
      sidebarAvatar.textContent = initials
    }
  }

  // Update transaction history page
  function updateTransactionHistory(user) {
    if (!user) return

    const historyTableBody = document.getElementById("history-table-body")
    const noHistory = document.getElementById("no-history")
    const historyTableContainer = document.querySelector(".history-table-container")

    if (!historyTableBody) return

    // Get user's transactions
    const userTransactions = transactions.filter((t) => t.to === user.email || t.from === user.email)

    // Sort by date (newest first)
    userTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    // Check if there are transactions
    if (userTransactions.length === 0) {
      if (noHistory) noHistory.style.display = "block"
      if (historyTableContainer) historyTableContainer.style.display = "none"
      return
    }

    // Hide no history message and show table
    if (noHistory) noHistory.style.display = "none"
    if (historyTableContainer) historyTableContainer.style.display = "block"

    // Clear table
    historyTableBody.innerHTML = ""

    // Add transactions to table
    userTransactions.forEach((transaction) => {
      const isCredit = transaction.to === user.email

      const tr = document.createElement("tr")
      tr.innerHTML = `
      <td>${formatDate(transaction.timestamp)}</td>
      <td>${transaction.description}</td>
      <td>${isCredit ? formatCurrency(transaction.amount) : "-" + formatCurrency(transaction.amount)}</td>
      <td>${isCredit ? "Credit" : "Debit"}</td>
      <td><span class="status ${transaction.status}">${transaction.status}</span></td>
    `

      historyTableBody.appendChild(tr)
    })
  }

  // Transaction type filter
  const transactionTypeFilter = document.getElementById("transaction-type")
  const dateRangeFilter = document.getElementById("date-range")

  if (transactionTypeFilter) {
    transactionTypeFilter.addEventListener("change", () => {
      filterTransactions()
    })
  }

  if (dateRangeFilter) {
    dateRangeFilter.addEventListener("change", () => {
      filterTransactions()
    })
  }

  function filterTransactions() {
    const currentUser = getCurrentUser()
    if (!currentUser) return

    const historyTableBody = document.getElementById("history-table-body")
    if (!historyTableBody) return

    const typeFilter = transactionTypeFilter ? transactionTypeFilter.value : "all"
    const dateFilter = dateRangeFilter ? dateRangeFilter.value : "all"

    // Get user's transactions
    let userTransactions = transactions.filter((t) => t.to === currentUser.email || t.from === currentUser.email)

    // Apply type filter
    if (typeFilter === "credit") {
      userTransactions = userTransactions.filter((t) => t.to === currentUser.email)
    } else if (typeFilter === "debit") {
      userTransactions = userTransactions.filter((t) => t.from === currentUser.email)
    }

    // Apply date filter
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    if (dateFilter === "today") {
      userTransactions = userTransactions.filter((t) => new Date(t.timestamp) >= today)
    } else if (dateFilter === "week") {
      userTransactions = userTransactions.filter((t) => new Date(t.timestamp) >= weekStart)
    } else if (dateFilter === "month") {
      userTransactions = userTransactions.filter((t) => new Date(t.timestamp) >= monthStart)
    }

    // Sort by date (newest first)
    userTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    // Clear table
    historyTableBody.innerHTML = ""

    // Check if there are transactions after filtering
    const noHistory = document.getElementById("no-history")
    const historyTableContainer = document.querySelector(".history-table-container")

    if (userTransactions.length === 0) {
      if (noHistory) noHistory.style.display = "block"
      if (historyTableContainer) historyTableContainer.style.display = "none"
      return
    }

    // Hide no history message and show table
    if (noHistory) noHistory.style.display = "none"
    if (historyTableContainer) historyTableContainer.style.display = "block"

    // Add transactions to table
    userTransactions.forEach((transaction) => {
      const isCredit = transaction.to === currentUser.email

      const tr = document.createElement("tr")
      tr.innerHTML = `
      <td>${formatDate(transaction.timestamp)}</td>
      <td>${transaction.description}</td>
      <td>${isCredit ? formatCurrency(transaction.amount) : "-" + formatCurrency(transaction.amount)}</td>
      <td>${isCredit ? "Credit" : "Debit"}</td>
      <td><span class="status ${transaction.status}">${transaction.status}</span></td>
    `

      historyTableBody.appendChild(tr)
    })
  }

  // Coming soon modal
  const comingSoonModal = document.getElementById("coming-soon-modal")
  const closeModalElement = document.querySelector(".close-modal")
  const comingSoonTitle = document.getElementById("coming-soon-title")
  const comingSoonMessage = document.getElementById("coming-soon-message")

  // Update the showComingSoonModal function to properly format the amount
  function showComingSoonModal(title, message) {
    if (comingSoonTitle) comingSoonTitle.textContent = title || "Feature Coming Soon"
    if (comingSoonMessage)
      comingSoonMessage.textContent =
        message || "We're working hard to bring you this feature. Please check back later!"
    if (comingSoonModal) comingSoonModal.classList.add("active")
  }

  if (closeModalElement) {
    closeModalElement.addEventListener("click", () => {
      comingSoonModal.classList.remove("active")
    })
  }

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === comingSoonModal) {
      comingSoonModal.classList.remove("active")
    }
  })

  // Receipt modal function
  function showReceiptModal(data) {
    const receiptModal = document.getElementById("receipt-modal")
    const receiptAmount = document.getElementById("receipt-amount")
    const receiptRecipient = document.getElementById("receipt-recipient")
    const receiptAccount = document.getElementById("receipt-account")
    const receiptDescription = document.getElementById("receipt-description")
    const receiptDate = document.getElementById("receipt-date")
    const receiptReference = document.getElementById("receipt-reference")

    if (!receiptModal) {
      console.error("Receipt modal element not found!")
      return
    }

    // Fill in receipt details
    if (receiptAmount) receiptAmount.textContent = formatCurrency(data.amount)
    if (receiptRecipient) receiptRecipient.textContent = data.recipient
    if (receiptAccount) receiptAccount.textContent = data.recipientAccount
    if (receiptDescription) receiptDescription.textContent = data.description || "Transfer"
    if (receiptDate) receiptDate.textContent = data.date
    if (receiptReference) receiptReference.textContent = data.reference

    // Show the modal
    receiptModal.classList.add("active")
    receiptModal.style.display = "flex"

    // Add event listeners for receipt modal buttons
    const closeReceiptBtn = document.getElementById("close-receipt-btn")
    const shareReceiptBtn = document.getElementById("share-receipt-btn")
    const closeModalBtn = receiptModal.querySelector(".close-modal")

    // Close receipt button
    if (closeReceiptBtn) {
      closeReceiptBtn.onclick = () => {
        receiptModal.classList.remove("active")
        receiptModal.style.display = "none"
      }
    }

    // Share receipt button
    if (shareReceiptBtn) {
      shareReceiptBtn.onclick = () => {
        const receiptText = `
M&T BANK TRANSFER RECEIPT
------------------------
✅ Transfer Successful
Amount: ${formatCurrency(data.amount)}
Recipient: ${data.recipient}
Account: ${data.recipientAccount}
Description: ${data.description || "Transfer"}
Date: ${data.date}
Reference: ${data.reference}
------------------------
Thank you for banking with M&T BANK!
      `

        if (navigator.share) {
          navigator
            .share({
              title: "M&T BANK Transfer Receipt",
              text: receiptText,
            })
            .catch(() => {
              copyToClipboard(receiptText)
            })
        } else {
          copyToClipboard(receiptText)
        }
      }
    }

    // Close modal X button
    if (closeModalBtn) {
      closeModalBtn.onclick = () => {
        receiptModal.classList.remove("active")
        receiptModal.style.display = "none"
      }
    }

    // Close when clicking outside
    receiptModal.onclick = (e) => {
      if (e.target === receiptModal) {
        receiptModal.classList.remove("active")
        receiptModal.style.display = "none"
      }
    }
  }

  // Override the updateDashboard function to include our new updates
  const originalUpdateDashboard = updateDashboard

  updateDashboard = (user) => {
    if (originalUpdateDashboard) {
      originalUpdateDashboard(user)
    }

    // Update sidebar
    updateSidebar(user)

    // Update profile page
    updateProfilePage(user)

    // Update transaction history
    updateTransactionHistory(user)
  }

  // Add event listeners for quick action buttons
  const quickActionButtons = document.querySelectorAll(".action-item")

  if (quickActionButtons) {
    quickActionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const pageId = button.getAttribute("data-page")
        if (pageId) {
          showPage(pageId + "-page")
        }
      })
    })
  }

  // Add event listeners for bottom navigation
  const bottomNavItems = document.querySelectorAll(".nav-item")

  if (bottomNavItems) {
    bottomNavItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault()

        // Remove active class from all items
        bottomNavItems.forEach((i) => i.classList.remove("active"))

        // Add active class to clicked item
        item.classList.add("active")

        // Navigate to page
        const pageId = item.getAttribute("data-page") + "-page"
        showPage(pageId)
      })
    })
  }

  // Load data and check if user is logged in
  initializeApp()
})

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Receipt copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
        alert("Failed to copy receipt to clipboard. Please try again.")
      })
  } else {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.top = 0
    textArea.style.left = 0
    textArea.style.width = "2em"
    textArea.style.height = "2em"
    textArea.style.padding = 0
    textArea.style.border = "none"
    textArea.style.outline = "none"
    textArea.style.boxShadow = "none"
    textArea.style.background = "transparent"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand("copy")
      const msg = successful ? "successful" : "unsuccessful"
      console.log("Fallback: Copying text command was " + msg)
      alert("Receipt copied to clipboard!")
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err)
      alert("Failed to copy receipt to clipboard. Please try again.")
    }

    document.body.removeChild(textArea)
  }
}
