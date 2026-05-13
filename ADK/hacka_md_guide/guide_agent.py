from google.adk.agents.llm_agent import Agent
from google.genai import types


guide_agent = Agent(
    model='gemini-2.5-flash',
    name='guide_agent',
    mode='single_turn',
    description='Expert technical writer that synthesizes raw developer knowledge into a comprehensive, production-grade Markdown guide.',
    instruction="""
    - You are a technical writer.
    - Your job is to write a complete, production-grade Markdown guide for developers, based on the information retrieved from the search_agent and developer_knowledge_agent.

    - Input:
      1. search_agent's json results.
      2. developer_knowledge_agent's json results.

    - You must:
      1. Fully understand the topic.
      2. Extract the most relevant information.
      3. Write a complete guide in markdown format.

    - The guide must include:
      - Title
      - Introduction
      - Prerequisites
      - Step-by-step instructions
      - Code examples
      - Best practices
      - Common errors
      - Troubleshooting
      - Useful resources
      - Conclusion

   - The guide must be:
      - Easy to understand
      - Well-organized
      - Detailed
      - Accurate
      - Production-grade
      - Easy to navigate
      - Use headings, subheadings, bullet points, and code blocks

    - DO NOT MAKE UP OR GUESS INFORMATION. If you are not sure about something, rely on the information provided by the search_agent and developer_knowledge_agent.
    - For the love of all that is good DO NOT RETURN ANYTHING OTHER THAN PURE MARKDOWN.
    """,

    generate_content_config=types.GenerateContentConfig(
        max_output_tokens=16000,
    )
)
