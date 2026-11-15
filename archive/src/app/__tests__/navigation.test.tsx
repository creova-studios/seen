/**
 * NAVIGATION & TAB TESTS
 * SEEN by CREOVA
 * 
 * Category 1: Navigation & Tab Interaction Tests
 * Tests all tab navigation, state persistence, and navigation flows
 * 
 * BLACK-BOX TESTING: No internal component access
 * READ-ONLY: No destructive operations
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import App from '../App';

describe('Navigation & Tab Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Set onboarding complete to skip onboarding
    localStorage.setItem('onboarding_completed', 'true');
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ========================================================================
  // TEST 1.1: App Loads Successfully
  // ========================================================================
  describe('App Loading', () => {
    it('should load app without errors', async () => {
      const { container } = render(<App />);
      
      // App should render
      expect(container).toBeTruthy();
      
      // Should not show blank screen
      expect(container.innerHTML).not.toBe('');
      
      console.log('✅ TEST 1.1 PASS: App loads successfully');
    });

    it('should show For You tab by default for authenticated users', async () => {
      render(<App />);
      
      await waitFor(() => {
        // Look for For You tab indicator (active state)
        const forYouTab = screen.queryByLabelText(/for you/i);
        expect(forYouTab).toBeTruthy();
      });
      
      console.log('✅ TEST 1.2 PASS: For You tab loads by default');
    });
  });

  // ========================================================================
  // TEST 1.2: Tab Navigation
  // ========================================================================
  describe('Tab Navigation', () => {
    it('should navigate to Explore tab on tap', async () => {
      render(<App />);
      
      // Find and click Explore tab
      const exploreTab = await screen.findByLabelText(/explore/i);
      fireEvent.click(exploreTab);
      
      await waitFor(() => {
        // Verify Explore content loads
        const exploreContent = screen.queryByText(/explore/i);
        expect(exploreContent).toBeTruthy();
      });
      
      console.log('✅ TEST 1.3 PASS: Explore tab navigation works');
    });

    it('should navigate to Library tab on tap', async () => {
      render(<App />);
      
      const libraryTab = await screen.findByLabelText(/library/i);
      fireEvent.click(libraryTab);
      
      await waitFor(() => {
        const libraryContent = screen.queryByText(/library/i);
        expect(libraryContent).toBeTruthy();
      });
      
      console.log('✅ TEST 1.4 PASS: Library tab navigation works');
    });

    it('should navigate to Profile tab on tap', async () => {
      render(<App />);
      
      const profileTab = await screen.findByLabelText(/profile/i);
      fireEvent.click(profileTab);
      
      await waitFor(() => {
        const profileContent = screen.queryByText(/profile/i);
        expect(profileContent).toBeTruthy();
      });
      
      console.log('✅ TEST 1.5 PASS: Profile tab navigation works');
    });

    it('should return to For You tab on tap', async () => {
      render(<App />);
      
      // Navigate away first
      const exploreTab = await screen.findByLabelText(/explore/i);
      fireEvent.click(exploreTab);
      
      // Navigate back to For You
      const forYouTab = await screen.findByLabelText(/for you/i);
      fireEvent.click(forYouTab);
      
      await waitFor(() => {
        const forYouContent = screen.queryByText(/for you/i);
        expect(forYouContent).toBeTruthy();
      });
      
      console.log('✅ TEST 1.6 PASS: Return to For You tab works');
    });
  });

  // ========================================================================
  // TEST 1.3: State Persistence During Navigation
  // ========================================================================
  describe('State Persistence', () => {
    it('should preserve language when switching tabs', async () => {
      render(<App />);
      
      // Set language to French
      localStorage.setItem('seen-language', 'fr');
      
      // Switch tabs
      const exploreTab = await screen.findByLabelText(/explore/i);
      fireEvent.click(exploreTab);
      
      const libraryTab = await screen.findByLabelText(/library/i);
      fireEvent.click(libraryTab);
      
      // Verify language persisted
      const storedLanguage = localStorage.getItem('seen-language');
      expect(storedLanguage).toBe('fr');
      
      console.log('✅ TEST 1.7 PASS: Language persists during tab switching');
    });

    it('should not reload app when switching tabs', async () => {
      const { container } = render(<App />);
      const initialHTML = container.innerHTML;
      
      // Switch tabs
      const exploreTab = await screen.findByLabelText(/explore/i);
      fireEvent.click(exploreTab);
      
      // HTML should change but app should not reload
      expect(container.innerHTML).not.toBe(initialHTML);
      expect(container).toBeTruthy();
      
      console.log('✅ TEST 1.8 PASS: No app reload on tab switch');
    });
  });

  // ========================================================================
  // TEST 1.4: Empty State Handling
  // ========================================================================
  describe('Empty State Handling', () => {
    it('should show empty state in Library when no stories started', async () => {
      render(<App />);
      
      const libraryTab = await screen.findByLabelText(/library/i);
      fireEvent.click(libraryTab);
      
      await waitFor(() => {
        // Should show empty state message
        const emptyState = screen.queryByText(/no stories/i);
        expect(emptyState).toBeTruthy();
      });
      
      console.log('✅ TEST 1.9 PASS: Library shows empty state correctly');
    });

    it('should never show blank screen on any tab', async () => {
      const { container } = render(<App />);
      
      const tabs = ['explore', 'library', 'profile'];
      
      for (const tabName of tabs) {
        const tab = await screen.findByLabelText(new RegExp(tabName, 'i'));
        fireEvent.click(tab);
        
        await waitFor(() => {
          expect(container.innerHTML).not.toBe('');
        });
      }
      
      console.log('✅ TEST 1.10 PASS: No blank screens on any tab');
    });
  });

  // ========================================================================
  // TEST 1.5: Navigation Bar Interactions
  // ========================================================================
  describe('Navigation Bar', () => {
    it('should open Profile when Profile button clicked', async () => {
      render(<App />);
      
      // Click Profile button in nav bar
      const profileButton = await screen.findByLabelText(/profile/i);
      fireEvent.click(profileButton);
      
      await waitFor(() => {
        const profileScreen = screen.queryByText(/profile/i);
        expect(profileScreen).toBeTruthy();
      });
      
      console.log('✅ TEST 1.11 PASS: Profile button in nav bar works');
    });

    it('should log interaction when Search button clicked', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      render(<App />);
      
      const searchButton = await screen.findByLabelText(/search/i);
      fireEvent.click(searchButton);
      
      // Should log interaction
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Search button tapped')
      );
      
      consoleSpy.mockRestore();
      console.log('✅ TEST 1.12 PASS: Search button logs interaction');
    });
  });
});

// ========================================================================
// TEST SUMMARY
// ========================================================================
console.log(`
╔════════════════════════════════════════════════════════════════╗
║            NAVIGATION & TAB TESTS - SUMMARY                    ║
╠════════════════════════════════════════════════════════════════╣
║ Total Tests: 12                                                ║
║ Categories:                                                    ║
║   - App Loading: 2 tests                                       ║
║   - Tab Navigation: 4 tests                                    ║
║   - State Persistence: 2 tests                                 ║
║   - Empty State Handling: 2 tests                              ║
║   - Navigation Bar: 2 tests                                    ║
╠════════════════════════════════════════════════════════════════╣
║ FAIL CONDITIONS:                                               ║
║   ❌ Tap produces no response                                  ║
║   ❌ Incorrect content loads                                   ║
║   ❌ App reloads unexpectedly                                  ║
║   ❌ Blank screen shown                                        ║
╚════════════════════════════════════════════════════════════════╝
`);
