# HoverExplain Changelog

## Version 1.2.0 — January 31, 2026

### Added

- Rebrand to HoverExplain (name, marketing assets, and store metadata).
- New onboarding experience: step-by-step guidance and clearer in-product tips.
- Packaging helper command for producing a VSIX:
```bash
pnpm dlx @vscode/vsce package --no-dependencies
```

### Changed

- Clarified privacy and security messaging so users understand what (if any) data is transmitted.
- Improved hover explanation wording for greater clarity and reduced noise.

### Fixed

- Corrected the extension icon URL so the icon displays properly in the Marketplace.
- Various small UX fixes (status bar messages, prompt handling, and edge-case rendering).

Notes

- No breaking changes in this release. We recommend reloading or restarting VS Code after updating.

## Version 1.1.0 — January 30, 2026

### Added

- Branding: HoverLens
- Improved documentation and onboarding
- Updated Marketplace description
- New extension icon

### Changed

- Clearer privacy and security messaging
- Improved hover explanation clarity

### Fixed

- Minor UX inconsistencies

## 1.0.0

- Initial release