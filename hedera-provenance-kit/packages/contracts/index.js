/**
 * Hedera Provenance Kit - Smart Contracts & HCS Registry Interface
 *
 * Provides contract ABI references and consensus topic binding helpers
 * for decentralized tamper-evident record keeping.
 */

module.exports = {
  name: '@zenieverse/hedera-provenance-kit-contracts',
  version: '1.0.0',
  standard: 'Scaffold-HBAR',
  provenanceSchema: 'hpk.provenance.v1',
  defaultTopicMemo: 'Hedera Provenance Kit Consensus Registry',
  isContractsReady: () => true,
};
