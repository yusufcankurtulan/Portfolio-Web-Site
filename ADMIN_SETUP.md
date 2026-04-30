# Admin Panel Setup (Netlify)

This project now uses Decap CMS at `/admin/` and stores editable content in `content.json`.

## 1) Enable Identity

In Netlify:

1. Go to `Site configuration -> Identity`.
2. Click `Enable Identity`.
3. Set registration to `Invite only`.
4. Under `External providers`, keep disabled unless you need them.

## 2) Enable Git Gateway

In `Site configuration -> Identity -> Services`, enable `Git Gateway`.

## 3) Create your only admin user

1. In `Identity -> Users`, click `Invite users`.
2. Invite only your email.
3. Accept the invitation email and set your password.

No other users will be able to edit unless you explicitly invite them.

## 4) Use the panel

1. Open `https://<your-site>.netlify.app/admin/`
2. Login with your invited account.
3. Edit content and publish changes.

Published changes update `content.json` in your repository and are reflected on the website automatically after deploy.
