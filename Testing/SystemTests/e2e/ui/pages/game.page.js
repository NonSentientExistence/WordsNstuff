import { expect } from "@playwright/test";

export default class GamePage {
    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('/');
    }

    async startNewGame() {
        await this.page.locator('#createBtn').click();
    }

    async expectGameCreated() {
        await expect(this.page.locator('#game')).toBeVisible();
        await expect(this.page.locator('#gameIdGameOut')).not.toHaveText('-');
    }

    async getGameId() {
        const elem = await this.page.locator('#gameIdOut');
        return await elem.textContent();
    }

    async getPlayerToken() {
        const elem = await this.page.locator('#playerTokenOut');
        return await elem.textContent();
    }

    async getStatus() {
        const elem = await this.page.locator('#statusOut');
        return await elem.textContent();
    }

    async getCurrentWord() {
        const elem = await this.page.locator('#wordOut');
        return await elem.textContent();
    }

    async getPlayer1Score() {
        const elem = await this.page.locator('#p1ScoreOut');
        return parseInt(await elem.textContent());
    }

    async getPlayer2Score() {
        const elem = await this.page.locator('#p2ScoreOut');
        return parseInt(await elem.textContent());
    }

    async getAcceptButtonText() {
        const elem = await this.page.locator('#acceptBtn');
        return await elem.textContent();
    }

    async getDisputeButtonText() {
        const elem = await this.page.locator('#disputeBtn');
        return await elem.textContent();
    }

    async playLetter(letter) {
        await this.page.locator('#letterIn').fill(letter);
        await this.page.locator('#playBtn').click();
        await this.page.waitForTimeout(500);
    }

    async claimWord() {
        await this.page.locator('#claimBtn').click();
        await this.page.waitForTimeout(500);
    }

    async acceptClaim() {
        await this.page.locator('#acceptBtn').click();
        await this.page.waitForTimeout(500);
    }

    async disputeClaim() {
        await this.page.locator('#disputeBtn').click();
        await this.page.waitForTimeout(500);
    }

    async isClaimButtonDisabled() {
        return await this.page.locator('#claimBtn').isDisabled();
    }

    async isAcceptButtonDisabled() {
        return await this.page.locator('#acceptBtn').isDisabled();
    }

    async isDisputeButtonDisabled() {
        return await this.page.locator('#disputeBtn').isDisabled();
    }

    async getWordTiles() {
        const tiles = await this.page.locator('.word-tile').count();
        const letters = [];
        for (let i = 0; i < tiles; i++) {
            const text = await this.page.locator(`.word-tile`).nth(i).textContent();
            letters.push(text);
        }
        return letters.join('');
    }

    async copyGameLink() {
        await this.page.locator('#copyGameLinkBtn').click();
        return await this.page.locator('#gameLinkOut').textContent();
    }

    async joinGameById(gameId) {
        await this.page.locator('#joinGameId').fill(gameId);
        await this.page.locator('#joinBtn').click();
        await this.page.waitForTimeout(500);
    }

    async refreshPage() {
        await this.page.reload();
        await this.page.waitForTimeout(500);
    }

    async pollForGameStatus(expectedStatus, timeoutMs = 10000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeoutMs) {
            const status = await this.getStatus();
            if (status === expectedStatus) return true;
            await this.page.waitForTimeout(100);
        }
        return false;
    }

    async getGameLog() {
        const elem = await this.page.locator('#log');
        return await elem.textContent();
    }
}
