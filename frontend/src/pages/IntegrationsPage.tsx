import React, { useEffect, useState } from "react";
import "../styles/fonts.css";
import ThreeScene from "../components/ThreeScene";
import NavBar from "../components/NavBar";
import "../styles/IntegrationsPage.css"; // We'll create this file next

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
}

function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = [
    "All",
    "My Connections",
    "Popular",
    "Development",
    "Productivity",
    "Analytics",
    "Marketing",
    "Scraping",
    "Design",
    "Crypto",
    "Search",
    "AI",
    "Storage",
    "Knowledge",
  ];

  const integrations: Integration[] = [
    {
      id: "21st-dev",
      name: "21st Dev",
      description:
        "21st Dev provides a library of UI components for AI-powered development.",
      logo: "/pics/stdev.png",
      category: "Development",
    },
    {
      id: "airbnb",
      name: "Airbnb",
      description:
        "Airbnb is a platform for booking accommodations and experiences.",
      logo: "/pics/airbnb.png",
      category: "Travel",
    },
    {
      id: "airtable",
      name: "Airtable",
      description:
        "Create flexible databases, manage records, and collaborate with team members in Airtable.",
      logo: "/pics/airtable.png",
      category: "Productivity",
    },
    {
      id: "amazon-affiliate",
      name: "Amazon Affiliate",
      description: "Search Amazon, get products, add affiliate links.",
      logo: "/pics/amazon.png",
      category: "Marketing",
    },
    {
      id: "apollo",
      name: "Apollo",
      description:
        "Apollo is a platform for finding and connecting with people and organizations.",
      logo: "/pics/apollo.png",
      category: "Marketing",
    },
    {
      id: "asana",
      name: "Asana",
      description: "Plan and manage work, projects, and tasks with Asana.",
      logo: "/pics/asana.png",
      category: "Productivity",
    },
    {
      id: "bannerbear",
      name: "Bannerbear",
      description:
        "Auto-generate social media visuals, ecommerce banners and more.",
      logo: "/pics/banner bear.png",
      category: "Design",
    },
    {
      id: "binance",
      name: "Binance",
      description:
        "Trade cryptocurrencies on the world's largest crypto exchange.",
      logo: "/pics/binance.png",
      category: "Crypto",
    },
    {
      id: "brave-search",
      name: "Brave Search",
      description:
        "Get web search results from Brave's independent search engine.",
      logo: "/pics/brave.png",
      category: "Search",
    },
    {
      id: "chatgpt",
      name: "ChatGPT",
      description:
        "Interact with OpenAI's ChatGPT for natural language processing tasks.",
      logo: "/pics/chatgpt.png",
      category: "AI",
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Store and share files in the cloud with Dropbox.",
      logo: "/pics/dropbox.png",
      category: "Storage",
    },
    {
      id: "notion",
      name: "Notion",
      description:
        "All-in-one workspace for notes, docs, and project management.",
      logo: "/pics/notion.png",
      category: "Knowledge",
    },
  ];

  useEffect(() => {
    document.body.classList.add("loaded");
    return () => {
      document.body.classList.remove("loaded");
    };
  }, []);

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="App">
      <ThreeScene />

      <NavBar isSidebarOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />


      <div className="integrations-container">
        <h1 className="integrations-title">
          <span className="nex">Nex</span>
          <span className="flow">Flow</span>
          <span className="integration-text"> Integrations</span>
        </h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search integrations by name, description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="categories-scroll">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="integrations-grid">
          <div className="integration-request-card">
            <div className="card-content">
              <span className="question-mark">?</span>
              <h3>Integration Request</h3>
              <p>
                Request any integration we missed, and we'll work on adding!
              </p>
              <div className="card-actions">
                <button className="request-button">Request</button>
              </div>
            </div>
          </div>

          {filteredIntegrations.map((integration) => (
            <div key={integration.id} className="integration-card">
              <div className="card-content">
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className="integration-logo"
                />
                <h3>{integration.name}</h3>
                <p>{integration.description}</p>
                <div className="card-actions">
                  <button className="docs-button">Docs</button>
                  <button className="connect-button">Connect</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IntegrationsPage;