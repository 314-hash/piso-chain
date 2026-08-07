"""
Unit & Integration Tests for RefRef Referral & Affiliate Engine in PISO Chain.
Inspired by amicalhq/refref.
"""

import unittest
from core.refref_referral_engine import RefRefReferralEngine


class TestRefRefReferralEngine(unittest.TestCase):

    def setUp(self):
        self.engine = RefRefReferralEngine()

    def test_create_campaign(self):
        campaign = self.engine.create_campaign("Miner Onboarding", 100.0, "FIXED", "Test campaign")
        self.assertIn("campaign_id", campaign)
        self.assertEqual(campaign["reward_piso"], 100.0)

    def test_generate_referral_code(self):
        referrer = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
        record = self.engine.generate_referral_code(referrer)
        self.assertTrue(record["referral_code"].startswith("PISO-REF-"))
        self.assertEqual(record["referrer_address"], referrer.lower())

    def test_track_conversion(self):
        referrer = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
        referred = "0x3C44CdD47a356F4300374a3287339661161B406B"
        code_record = self.engine.generate_referral_code(referrer)
        ref_code = code_record["referral_code"]

        conversion = self.engine.track_conversion(ref_code, referred, "0xabc123")
        self.assertEqual(conversion["status"], "ATTRIBUTED_AND_DISBURSED")
        self.assertEqual(conversion["reward_piso"], 50.0)

        stats = self.engine.get_referral_stats(referrer)
        self.assertEqual(stats["total_conversions"], 1)
        self.assertEqual(stats["total_rewards_earned_piso"], 50.0)


if __name__ == "__main__":
    unittest.main()
