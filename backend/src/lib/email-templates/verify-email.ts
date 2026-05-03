type VerifyEmailTemplateArgs = {
  appName: string;
  userName: string;
  url: string;
};

export function renderVerifyEmailHtml({
  appName,
  userName,
  url,
}: VerifyEmailTemplateArgs): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --email-bg: #F0F0FF;
      --email-card: #FFFFFF;
      --email-fg: #080616;
      --email-muted: #162E93;
      --email-border: #C8C8F0;
      --email-primary: #2F2FE4;
      --email-on-primary: #FFFFFF;
      --email-surface: #E8E8FF;
      --email-primary-10: rgba(47, 47, 228, 0.10);
      --email-primary-13: rgba(47, 47, 228, 0.13);
      --email-primary-20: rgba(47, 47, 228, 0.20);
    }

    body {
      background: linear-gradient(180deg, var(--email-bg) 0%, var(--email-card) 100%);
      font-family: 'DM Sans', sans-serif;
      font-weight: 400;
      color: var(--email-fg);
      padding: 40px 16px;
    }

    .email-wrapper {
      max-width: 560px;
      margin: 0 auto;
    }

    /* Wordmark */
    .wordmark {
      text-align: center;
      margin-bottom: 40px;
    }

    .wordmark span {
      font-family: 'DM Serif Display', serif;
      font-style: italic;
      font-size: 28px;
      letter-spacing: -0.5px;
      color: var(--email-fg);
    }

    .wordmark span em {
      font-style: normal;
      color: var(--email-primary);
    }

    /* Main card */
    .card {
      background: var(--email-card);
      border: 1px solid var(--email-border);
      border-radius: 20px;
      overflow: hidden;
    }

    /* Header stripe */
    .card-header {
      background: linear-gradient(135deg, var(--email-surface) 0%, var(--email-card) 100%);
      border-bottom: 1px solid var(--email-border);
      padding: 48px 48px 40px;
      text-align: center;
      position: relative;
    }

    /* Ornamental ring */
    .icon-ring {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      border: 1px solid var(--email-primary-20);
      background: var(--email-card);
      margin-bottom: 24px;
      position: relative;
    }

    .icon-ring::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 1px solid var(--email-primary-13);
    }

    .icon-ring svg {
      width: 32px;
      height: 32px;
      stroke: var(--email-primary);
      stroke-width: 1.5;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .card-header h1 {
      font-family: 'DM Serif Display', serif;
      font-size: 30px;
      font-weight: 400;
      letter-spacing: -0.5px;
      color: var(--email-fg);
      line-height: 1.2;
      margin-bottom: 12px;
    }

    .card-header p {
      font-size: 14px;
      color: var(--email-muted);
      font-weight: 300;
      line-height: 1.6;
      max-width: 340px;
      margin: 0 auto;
    }

    /* Body */
    .card-body {
      padding: 40px 48px;
    }

    .greeting {
      font-size: 15px;
      color: var(--email-muted);
      line-height: 1.7;
      margin-bottom: 32px;
    }

    .greeting strong {
      color: var(--email-fg);
      font-weight: 500;
    }

    /* CTA Button */
    .cta-wrapper {
      text-align: center;
      margin-bottom: 36px;
    }

    .cta-btn {
      display: inline-block;
      padding: 14px 40px;
      background: var(--email-primary);
      color: var(--email-on-primary) !important;
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 14px;
      letter-spacing: 0.5px;
      border-radius: 100px;
      transition: opacity 0.2s;
    }

    /* Divider */
    .divider {
      border: none;
      border-top: 1px solid var(--email-border);
      margin: 32px 0;
    }

    /* Fallback link */
    .fallback {
      font-size: 12px;
      color: var(--email-muted);
      line-height: 1.7;
    }

    .fallback p {
      margin-bottom: 8px;
    }

    .fallback .link-box {
      background: var(--email-bg);
      border: 1px solid var(--email-border);
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 11px;
      word-break: break-all;
      color: var(--email-fg);
      font-family: 'Courier New', monospace;
    }

    /* Expiry notice */
    .expiry-notice {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--email-bg);
      border: 1px solid var(--email-border);
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 28px;
    }

    .expiry-notice svg {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      stroke: var(--email-primary);
      stroke-width: 1.5;
      fill: none;
      stroke-linecap: round;
    }

    .expiry-notice span {
      font-size: 12px;
      color: var(--email-muted);
    }

    .expiry-notice span strong {
      color: var(--email-primary);
      font-weight: 500;
    }

    /* Footer */
    .card-footer {
      border-top: 1px solid var(--email-border);
      padding: 24px 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .footer-text {
      font-size: 11px;
      color: var(--email-muted);
      line-height: 1.6;
    }

    .footer-links {
      display: flex;
      gap: 16px;
      flex-shrink: 0;
    }

    .footer-links a {
      font-size: 11px;
      color: var(--email-muted);
      text-decoration: none;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .card-header,
      .card-body {
        padding-left: 28px;
        padding-right: 28px;
      }

      .card-footer {
        flex-direction: column;
        align-items: flex-start;
        padding-left: 28px;
        padding-right: 28px;
      }
    }
  </style>
</head>
<body>

  <div class="email-wrapper">

    <div class="wordmark">
      <span>${appName}<em></em></span>
    </div>

    <div class="card">

      <div class="card-header">
        <div class="icon-ring">
          <svg viewBox="0 0 24 24">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <h1>Verify your email<br>address</h1>
        <p>One small step to unlock everything. Confirm your email to activate your account.</p>
      </div>

      <div class="card-body">

        <p class="greeting">
          Hello, <strong>${userName}</strong> — welcome aboard.<br><br>
          You recently created an account using this email address. To complete your registration and start using your account, please verify that this is you.
        </p>

        <div class="expiry-notice">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v5l3 3"/>
          </svg>
          <span>This link expires in <strong>24 hours</strong>. After that, you'll need to request a new one.</span>
        </div>

        <div class="cta-wrapper">
          <a href="${url}" class="cta-btn">Verify my email address</a>
        </div>

        <hr class="divider" />

        <div class="fallback">
          <p>If the button above doesn't work, copy and paste this link into your browser:</p>
          <div class="link-box">${url}</div>
        </div>

      </div>

      <div class="card-footer">
        <p class="footer-text">
          If you didn't create an account,<br>you can safely ignore this email.
        </p>
        <div class="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Help</a>
          <a href="#">Unsubscribe</a>
        </div>
      </div>

    </div>

  </div>

</body>
</html>`;
}
