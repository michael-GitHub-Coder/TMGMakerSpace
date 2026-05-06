# 🔐 Security Guide for TMG Makerspace

## 🚨 CRITICAL SECURITY NOTES

### ❌ NEVER COMMIT THESE FILES:
- `.env` files (contain database passwords, email credentials)
- `test-*.js`, `debug-*.js`, `check-*.js` (contain sensitive test data)
- `*.sql`, `*.dump`, `*.backup` files (database backups)
- `*.pem`, `*.key`, `*.crt` files (SSL certificates)
- `config.json`, `secrets.json`, `credentials.json`
- Any files with API keys, passwords, or personal data

### ✅ SECURITY MEASURES IN PLACE:

#### 1. Enhanced .gitignore
```
# Environment files (MOST IMPORTANT)
.env
.env.local
.env.development
.env.production

# Test scripts with sensitive data
test-*.js
debug-*.js
check-*.js

# Database backups
*.sql
*.dump
*.backup
*.bak

# SSL certificates and keys
*.pem
*.key
*.crt
*.p12

# UI libraries (minified files)
frontend/src/UI/libs/**/*.min.js
frontend/src/UI/libs/**/*.min.css
frontend/src/UI/libs/**/*.map
```

#### 2. Security Check Script
Run before committing:
```bash
node check-sensitive-files.js
```

#### 3. Pre-commit Hook (Optional)
Install to automatically check before commits:
```bash
cp pre-commit-check.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## 🛡️ BEFORE YOU COMMIT:

### Step 1: Run Security Check
```bash
node check-sensitive-files.js
```

### Step 2: Check Git Status
```bash
git status
```

### Step 3: Review Changes
```bash
git diff --cached
```

### Step 4: Commit Only Safe Files
```bash
git add src/ package.json package-lock.json
git commit -m "Your commit message"
```

## 🚨 IMMEDIATE ACTIONS REQUIRED:

### 1. Remove node_modules from git:
```bash
git rm -r --cached backend/node_modules
git rm -r --cached frontend/node_modules
git rm -r --cached node_modules
```

### 2. Remove sensitive test files:
```bash
git rm --cached backend/test-*.js
git rm --cached backend/debug-*.js  
git rm --cached backend/check-*.js
```

### 3. Remove UI libraries:
```bash
git rm -r --cached frontend/src/UI/libs
```

### 4. Commit the cleanup:
```bash
git add .gitignore
git commit -m "🔒 Security: Remove sensitive files and enhance .gitignore"
```

## 📋 SENSITIVE DATA CURRENTLY IN .env:
```
DB_HOST=localhost
DB_PASS=Ntokz@084
EMAIL_USER=Ntokozomokoena07@gmail.com
EMAIL_PASS=vlrpaszhwxisznxg
```

**⚠️ These should NEVER be committed to GitHub!**

## 🔍 REGULAR SECURITY CHECKS:

### Weekly Security Audit:
1. Run `node check-sensitive-files.js`
2. Review `git log --oneline -10` for recent commits
3. Check GitHub repository for any accidental commits

### After Adding New Features:
1. Check if new files contain sensitive data
2. Update .gitignore if needed
3. Run security check before commit

## 🆘 IF YOU ACCIDENTALLY COMMIT SENSITIVE DATA:

### Immediate Actions:
1. **Remove the file from the repository:**
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch filename' --prune-empty --tag-name-filter cat -- --all
   ```

2. **Force push to remove from history:**
   ```bash
   git push origin --force --all
   ```

3. **Rotate all exposed credentials:**
   - Change database password
   - Change email password
   - Update API keys
   - Revoke any exposed tokens

4. **Review GitHub repository access**

## 📞 SECURITY CONTACT:
If you suspect a security breach:
1. Immediately change all passwords
2. Revoke API keys
3. Review repository access
4. Contact system administrator

**Remember: It's better to be safe than sorry!** 🔒
