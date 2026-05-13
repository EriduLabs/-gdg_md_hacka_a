from .search_agent import search_agent
from .mcp_agent import developer_knowledge_agent
from .guide_agent import guide_agent
from google.adk.agents.sequential_agent import SequentialAgent
 
root_agent = SequentialAgent(
    name="Sequential_agent",
    description="Executes a sequence to build a comprehensive guide for developers.",
    sub_agents=[search_agent, developer_knowledge_agent, guide_agent],
)
