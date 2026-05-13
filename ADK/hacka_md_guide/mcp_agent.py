import os
from google.adk.agents.llm_agent import Agent
from google.adk.tools.mcp_tool import McpToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPConnectionParams
from google.genai import types

# Retrieve the API key from an environment variable or directly insert it.
# Using an environment variable is generally safer.
# Ensure this environment variable is set in the terminal where you run 'adk web'.
# Example: export GOOGLE_MAPS_API_KEY="YOUR_ACTUAL_KEY"
DEVELOPER_KNOWLEDGE_API_KEY = os.getenv("AIzaSyAkeTx_lgiNwvVlhyLapwxTqPi2lvNwxD4")

if not DEVELOPER_KNOWLEDGE_API_KEY:
    # Fallback or direct assignment for testing - NOT RECOMMENDED FOR PRODUCTION
    DEVELOPER_KNOWLEDGE_API_KEY = "AIzaSyAkeTx_lgiNwvVlhyLapwxTqPi2lvNwxD4" # Replace if not using env var
    if DEVELOPER_KNOWLEDGE_API_KEY == "AIzaSyAkeTx_lgiNwvVlhyLapwxTqPi2lvNwxD4":
        print("WARNING:DEVELOPER_KNOWLEDGE_API_KEY is not set. Please set it as an environment variable or in the script.")
        # You might want to raise an error or exit if the key is crucial and not found.

developer_knowledge_agent = Agent(
    model='gemini-2.5-flash',
    name='developer_knowledge_agent',
    mode='single_turn',
    description='You are a helpful assistant that gathers information for google guides for developers by using your MCP abilities.',
    instruction="""
        **INFORMATION TO USE: gather Guide documentation and information for the next agent to build the final guide
            -BY USING THE SEARCH_AGENTS INFORMATION TO CHOOSE WHAT TO SEARCH FOR IN THE DEVELOPERKNOWLEDGE BASE
            -IMPORTANT:THIS INFORMATION IS YOUR MOST IMPORTANT TASK. WITHOUT IT, THE GUIDE_AGENT CANNOT BUILD THE COMPLETE 
            -(THE TOPIC CHOSEN SHOULD OF BEEN PROVIDED IN SEARCH_AGENT'S RESULTS) IMPORTANT:THIS IMFORMATION IS ONLY SUPPOSED TO BE ABOUT ONE TOPIC (ONE OF THE TOPICS YOU USE FROM HERE e.g. an update or new feature or a new tool or software or library or API etc)
            -this information will be used by the guide_agent to build the complete guide :**
    
        -you will take information from the search agent's search results and use its findings to identify what to use your MCP abilities to search chuncks of developerknowledge,
        so you can find the information and documentation to build the contents of the complete guide documentation.
        -Return the information in markdown format as a markdown format comprehensive guide for the community to use and learn and stay ahead when it comes to developing with google 
        - CHUNK DATA you shouldnt be pulling entire documents at once retreive chuncks and combine them to create your guide
        - The content should be very detailed and comprehensive, including code examples, best practices, and any other relevant information.
        - Focus on what query needs clarification from search results to find the best information and documentation to build the contents of the complete guide documentation.
        - DO NOT MAKE UP OR GUESS INFORMATION, IF YOU ARE NOT SURE ABOUT SOMETHING RELY ON YOUR MCP TOOLS TO FIND THE INFORMATION FOR YOU.
        - For the love of all that is good DO NOT RETURN ANYTHING OTHER THAN PURE MARKDOWN.
    """,

    generate_content_config=types.GenerateContentConfig(
        max_output_tokens=8000,  
    ),
    tools=[
        McpToolset(
            connection_params=StreamableHTTPConnectionParams(
                url="https://developerknowledge.googleapis.com/mcp",
                headers={
                    "X-Goog-Api-Key": "AIzaSyAkeTx_lgiNwvVlhyLapwxTqPi2lvNwxD4",
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            ),
            tool_filter=[
                'search_documents'

            ]
        )
    ]
)