import { test, expect } from '@playwright/test'

test.describe('Landing Page E2E', () => {
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check that the logo or title contains CarbonTrack
    await expect(page.locator('text=CarbonTrack')).toBeVisible()
    
    // Check the main heading
    await expect(page.locator('h1')).toContainText('Carbon Footprint')
    
    // Check that the "Start Calculator" button is present
    const startBtn = page.locator('text=Start Calculator').first()
    await expect(startBtn).toBeVisible()
  })
})
