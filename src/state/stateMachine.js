export const PHASE = {
  ORDERS_P1: 'ORDERS_P1',
  PASS_TO_P2: 'PASS_TO_P2',
  ORDERS_P2: 'ORDERS_P2',
  RESOLVING: 'RESOLVING',
};

export function createStateMachine(onChange) {
  let phase = PHASE.ORDERS_P1;

  function set(next) {
    phase = next;
    onChange(phase);
  }

  return {
    getPhase: () => phase,
    lockInP1: () => set(PHASE.PASS_TO_P2),
    confirmPassToP2: () => set(PHASE.ORDERS_P2),
    lockInP2: () => set(PHASE.RESOLVING),
    finishResolving: () => set(PHASE.ORDERS_P1),
  };
}
