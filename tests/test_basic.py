import unittest

class TestBasic(unittest.TestCase):
    """기본 테스트 케이스"""
    
    def test_true_is_true(self):
        """항상 성공하는 테스트"""
        self.assertTrue(True)
    
    def test_one_plus_one_equals_two(self):
        """1 + 1 = 2 테스트"""
        self.assertEqual(1 + 1, 2)
    
if __name__ == "__main__":
    unittest.main() 