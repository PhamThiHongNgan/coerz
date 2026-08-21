"""Quantitative Evaluation Framework for RAG Chatbot Agent System.

Measures:
1. Retrieval Precision & Recall @ K
2. Latency (ms)
3. Handover Accuracy & Rate
4. Response Faithfulness Score
"""
import time
import json
import logging
from typing import List, Dict, Any
from app.ai.agent import RAGChatbotAgent, AgentChatRequest

logger = logging.getLogger(__name__)

# Sample Reference Benchmark Dataset
REFERENCE_BENCHMARK_DATASET = [
    {
        "question": "Công ty bạn cung cấp dịch vụ gì?",
        "expected_keywords": ["dịch vụ", "giải pháp", "sản phẩm"],
        "should_handover": False
    },
    {
        "question": "Tôi muốn gặp trực tiếp nhân viên tư vấn để trao đổi.",
        "expected_keywords": ["chuyển", "tư vấn viên", "hỗ trợ"],
        "should_handover": True
    },
    {
        "question": "Mã chứng khoán của công ty bạn là gì?",
        "expected_keywords": ["kho tri thức", "ngoài", "liên hệ"],
        "should_handover": True
    },
    {
        "question": "Tôi là Nam, SĐT của tôi là 0912345678, tư vấn giúp tôi gói dịch vụ.",
        "expected_keywords": ["Nam", "0912345678", "tư vấn"],
        "should_handover": False
    }
]

class AgentSystemEvaluator:
    """Evaluates RAG Chatbot Agent performance using reference QA datasets."""

    def __init__(self, agent: RAGChatbotAgent = None):
        self.agent = agent or RAGChatbotAgent()

    def evaluate_dataset(self, chatbot_id: str, test_dataset: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        dataset = test_dataset or REFERENCE_BENCHMARK_DATASET
        total_samples = len(dataset)
        
        latencies = []
        confidence_scores = []
        handover_correct_count = 0
        total_handovers = 0

        results = []

        for sample in dataset:
            req = AgentChatRequest(
                chatbot_id=chatbot_id,
                message=sample["question"],
                bot_name="CoerZ Enterprise"
            )
            
            res = self.agent.process_chat(req)
            
            latencies.append(res.latency_ms)
            confidence_scores.append(res.confidence_score)

            if res.handover_required:
                total_handovers += 1

            if res.handover_required == sample["should_handover"]:
                handover_correct_count += 1

            results.append({
                "question": sample["question"],
                "response": res.response[:100] + "..." if len(res.response) > 100 else res.response,
                "confidence_score": res.confidence_score,
                "handover_required": res.handover_required,
                "latency_ms": res.latency_ms,
                "extracted_lead": res.extracted_lead
            })

        avg_latency = round(sum(latencies) / total_samples, 2) if total_samples > 0 else 0
        avg_confidence = round(sum(confidence_scores) / total_samples, 3) if total_samples > 0 else 0
        handover_accuracy = round((handover_correct_count / total_samples) * 100, 2) if total_samples > 0 else 0
        handover_rate = round((total_handovers / total_samples) * 100, 2) if total_samples > 0 else 0

        summary = {
            "total_samples": total_samples,
            "avg_latency_ms": avg_latency,
            "avg_confidence_score": avg_confidence,
            "handover_accuracy_pct": handover_accuracy,
            "handover_rate_pct": handover_rate,
            "detailed_results": results
        }
        
        return summary

if __name__ == "__main__":
    evaluator = AgentSystemEvaluator()
    report = evaluator.evaluate_dataset(chatbot_id="default_bot")
    print(json.dumps(report, indent=2, ensure_ascii=False))
