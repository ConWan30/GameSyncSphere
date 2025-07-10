// Example 1: Game Developer using the API
class GameDeveloperIntegration {
  constructor() {
    this.api = new GameSyncSphereAPI('dev_api_key_xyz');
  }
  
  async optimizeGameBalance() {
    // Get real-time player frustration data to balance game difficulty
    const insights = await this.api.generateCustomInsights({
      question: "Which weapon in our FPS causes most player frustration?",
      playerSegment: "casual_players",
      scope: "last_7_days",
      timeline: "standard"
    });
    
    // Use insights to automatically adjust weapon damage values
    if (insights.findings.keyFindings.includes("sniper_rifle_overpowered")) {
      // Automatically suggest balance changes
      return {
        weapon: "sniper_rifle",
        suggestedNerf: "reduce_damage_by_15_percent",
        affectedPlayers: insights.dataPoints,
        confidenceLevel: insights.confidence
      };
    }
  }
}

export { GameDeveloperIntegration };
