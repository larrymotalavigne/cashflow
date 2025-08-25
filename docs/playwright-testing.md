# Playwright User Testing Documentation

## Overview

This document describes the Playwright end-to-end testing setup implemented for the CashFlow Game application. The test suite provides comprehensive coverage of user scenarios, ensuring the application works correctly across different browsers and devices.

## Test Suite Structure

### Test Files

The test suite is organized into four main test files:

1. **`app-startup.spec.ts`** - Application startup and navigation tests
2. **`game-interaction.spec.ts`** - Game functionality and user interactions
3. **`language-toggle.spec.ts`** - Language switching functionality
4. **`theme-and-features.spec.ts`** - Theme toggle and advanced features

### Coverage Areas

#### 1. Application Startup Tests
- Startup screen loading and visibility
- Player name input functionality
- Difficulty selection dropdown
- Start game button functionality
- Theme and language toggle components
- Navigation to game screen
- Random name generation
- Resume game functionality

#### 2. Game Interaction Tests
- Game panels display after starting
- Player information display
- Investment options visibility
- Financial calculator integration
- Game controls interaction
- Chart display (Chart.js integration)
- Responsive design on mobile viewports
- Game state maintenance
- Toast notifications system
- Confirmation dialogs
- Navigation back to startup screen

#### 3. Language Toggle Tests
- Language toggle component visibility
- Language switching functionality
- Persistence across navigation
- Language options display
- Keyboard navigation support
- Accessibility standards compliance
- Mobile viewport compatibility
- Rapid switching handling

#### 4. Theme and Advanced Features Tests
- Theme toggle component display
- Light/dark theme switching
- Theme persistence across navigation
- PWA service worker functionality
- Accessibility features
- Toast notification system
- Confirmation dialog system
- Multi-viewport responsive design
- Chart.js integration
- Investment carousel functionality
- Financial calculator display
- Game configuration handling
- Performance standards validation

## Configuration

### Playwright Configuration (`playwright.config.ts`)

The configuration includes:

- **Test Directory**: `./tests`
- **Browser Support**: Chromium, Firefox, WebKit
- **Mobile Testing**: Pixel 5, iPhone 12
- **Base URL**: `http://localhost:4200`
- **Auto Dev Server**: Starts Angular dev server automatically
- **Reporting**: HTML reports with trace collection
- **Screenshots**: On test failure
- **Parallel Execution**: Enabled for faster test runs

### Supported Browsers and Devices

- **Desktop Browsers**:
  - Chrome (Chromium)
  - Firefox
  - Safari (WebKit)

- **Mobile Devices**:
  - Pixel 5 (Chrome Mobile)
  - iPhone 12 (Safari Mobile)

## Running Tests

### Available Scripts

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# View test reports
npm run test:e2e:report

# Install Playwright browsers
npm run test:e2e:install
```

### Basic Usage

1. **Install browsers** (first time setup):
   ```bash
   npm run test:e2e:install
   ```

2. **Run all tests**:
   ```bash
   npm run test:e2e
   ```

3. **View test results**:
   ```bash
   npm run test:e2e:report
   ```

### Development Workflow

1. **During Development** - Use UI mode for interactive testing:
   ```bash
   npm run test:e2e:ui
   ```

2. **Debugging Failures** - Use debug mode:
   ```bash
   npm run test:e2e:debug
   ```

3. **Visual Testing** - Use headed mode:
   ```bash
   npm run test:e2e:headed
   ```

## Test Features

### Robust Selectors

Tests use flexible selectors that work across different UI implementations:
- Component selectors (e.g., `app-startup-screen`)
- Text-based selectors (e.g., `button:has-text("Start")`)
- Attribute-based selectors (e.g., `input[placeholder*="name"]`)
- PrimeNG component selectors (e.g., `p-button`, `p-dropdown`)

### Conditional Testing

Tests handle optional components gracefully:
- Components that may not be visible initially
- Features that depend on game state
- Platform-specific functionality

### Accessibility Testing

- Keyboard navigation validation
- ARIA attributes verification
- Focus management testing
- Screen reader compatibility

### Performance Testing

- Navigation timing measurement
- DOM content loading validation
- Page responsiveness verification

## Continuous Integration

### GitHub Actions Integration

The tests can be integrated with GitHub Actions for automated testing:

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npm run test:e2e
```

### Test Reports

- **HTML Reports**: Generated automatically with trace viewer
- **Screenshots**: Captured on test failures
- **Video Recording**: Available for failed tests
- **Trace Files**: For detailed debugging

## Best Practices

### Test Organization

1. **Descriptive Test Names**: Clear, specific test descriptions
2. **Grouped Tests**: Related tests organized in describe blocks
3. **Setup/Teardown**: Proper beforeEach/afterEach hooks
4. **Independent Tests**: Each test can run independently

### Maintenance

1. **Regular Updates**: Keep Playwright version updated
2. **Browser Updates**: Regularly update browser versions
3. **Selector Reviews**: Review selectors when UI changes
4. **Performance Monitoring**: Monitor test execution times

### Debugging

1. **Use UI Mode**: For interactive debugging
2. **Add Screenshots**: For visual verification
3. **Use Trace Viewer**: For detailed execution analysis
4. **Console Logs**: Check browser console for errors

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Increase timeout values or improve selectors
2. **Flaky Tests**: Add proper waits and stable selectors
3. **Browser Issues**: Update browsers with `npm run test:e2e:install`
4. **Dev Server**: Ensure Angular dev server starts properly

### Solutions

1. **Element Not Found**: Use more flexible selectors
2. **Timing Issues**: Add explicit waits
3. **State Management**: Reset application state between tests
4. **Cross-browser Issues**: Test on specific browsers

## Future Enhancements

### Potential Additions

1. **Visual Regression Testing**: Screenshot comparisons
2. **API Testing**: Integration with backend services
3. **Load Testing**: Performance under stress
4. **Accessibility Audits**: Automated a11y testing
5. **Mobile App Testing**: Native mobile app support

### Advanced Features

1. **Page Object Models**: For better test maintainability
2. **Custom Fixtures**: Reusable test setup
3. **Data-driven Tests**: Parameterized test scenarios
4. **Cross-browser Parallel**: Simultaneous browser testing

## Support

For issues or questions regarding the Playwright testing setup:

1. Review this documentation
2. Check Playwright official documentation
3. Examine test code for examples
4. Run tests in debug mode for troubleshooting

## Conclusion

This Playwright testing setup provides comprehensive coverage of the CashFlow Game application, ensuring reliability across different browsers and devices. The flexible test structure allows for easy maintenance and extension as the application evolves.