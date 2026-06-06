import type { AgentVisibilityRule, PersonalityAgent, SocialCircle } from '@/types';

/**
 * Social-circle permission system.
 *
 * Visibility is decided by explicit (agent, circle) rules in
 * `agent_visibility_rules`. A rule with `isVisible: true` exposes that agent to
 * everyone in that circle. When no rule exists for a pair, the agent is treated
 * as NOT visible to that circle (private by default) — owners must opt in.
 */

/** Index rules by `${agentId}:${circleId}` for O(1) lookups. */
function ruleKey(agentId: string, circleId: string): string {
  return `${agentId}:${circleId}`;
}

export function buildRuleIndex(rules: AgentVisibilityRule[]): Map<string, AgentVisibilityRule> {
  const index = new Map<string, AgentVisibilityRule>();
  for (const rule of rules) {
    index.set(ruleKey(rule.agentId, rule.circleId), rule);
  }
  return index;
}

/** Whether a given circle can currently see a given agent. */
export function canCircleSeeAgent(
  rules: AgentVisibilityRule[],
  agentId: string,
  circleId: string,
): boolean {
  const rule = rules.find((r) => r.agentId === agentId && r.circleId === circleId);
  return rule?.isVisible ?? false;
}

/** All agents currently exposed to a circle. */
export function agentsVisibleToCircle(
  agents: PersonalityAgent[],
  rules: AgentVisibilityRule[],
  circleId: string,
): PersonalityAgent[] {
  const index = buildRuleIndex(rules);
  return agents.filter(
    (agent) => agent.isActive && index.get(ruleKey(agent.id, circleId))?.isVisible === true,
  );
}

/** All circles that can currently see a given agent. */
export function circlesThatCanSeeAgent(
  circles: SocialCircle[],
  rules: AgentVisibilityRule[],
  agentId: string,
): SocialCircle[] {
  const index = buildRuleIndex(rules);
  return circles.filter((circle) => index.get(ruleKey(agentId, circle.id))?.isVisible === true);
}

/**
 * Compute which agents a specific viewer may interact with on an owner's
 * profile, based on the circles the viewer belongs to. The union of all agents
 * exposed to any of the viewer's circles is returned.
 */
export function agentsVisibleToViewer(
  agents: PersonalityAgent[],
  rules: AgentVisibilityRule[],
  viewerCircleIds: string[],
): PersonalityAgent[] {
  const index = buildRuleIndex(rules);
  const allowed = new Set<string>();
  for (const circleId of viewerCircleIds) {
    for (const agent of agents) {
      if (index.get(ruleKey(agent.id, circleId))?.isVisible === true) {
        allowed.add(agent.id);
      }
    }
  }
  return agents.filter((agent) => agent.isActive && allowed.has(agent.id));
}
