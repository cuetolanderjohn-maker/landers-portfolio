(function () {
  "use strict";

  var root = document.querySelector("[data-pt-demo]");
  var scene = document.querySelector(".pt-scroll-scene");
  var sticky = document.querySelector(".pt-sticky");
  var track = document.querySelector("[data-pt-track]");
  var selectedViewport = document.querySelector(".pt-viewport--selected");
  var modal = document.querySelector("[data-pt-modal]");

  if (!root || !scene || !sticky || !track || !modal) {
    return;
  }

  // Embedded mode keeps the list stable inside page2 while preserving modal behavior.
  var embedHost = root.closest(".portfolio-embed") || root.closest('[data-pt-embed="overlay"]');
  var isEmbedMode = Boolean(embedHost) || root.getAttribute("data-pt-embed") === "overlay";

  var closeControls = modal.querySelectorAll("[data-pt-close]");
  var projectButtons = document.querySelectorAll("[data-pt-project]");
  var nodeItems = document.querySelectorAll(".pt-zone-selected .pt-node");
  var modalTitle = modal.querySelector("[data-pt-modal-title]");
  var modalYear = modal.querySelector("[data-pt-modal-year]");
  var modalSubtitle = modal.querySelector("[data-pt-modal-subtitle]");
  var modalIntro = modal.querySelector("[data-pt-modal-intro]");
  var modalCase = modal.querySelector("[data-pt-modal-case]");
  var modalRole = modal.querySelector("[data-pt-modal-role]");
  var modalTools = modal.querySelector("[data-pt-modal-tools]");
  var modalOutcome = modal.querySelector("[data-pt-modal-outcome]");
  var modalVisual = modal.querySelector("[data-pt-modal-visual]");
  var modalVisualPrev = modal.querySelector("[data-pt-visual-prev]");
  var modalVisualNext = modal.querySelector("[data-pt-visual-next]");
  var modalVisualNavRail = modal.querySelector(".pt-visual-nav-rail");
  var modalSectionTabs = modal.querySelector("[data-pt-section-tabs]");
  var modalPager = modal.querySelector("[data-pt-page-dots]");
  var scrollHighlightTimer = null;
  var lastFocusedElement = null;
  var lockedScrollY = 0;
  var rafId = null;
  var maxTranslate = 0;
  var activePagedProject = null;
  var activeProject = null;
  var activeSectionIndex = 0;
  var activePageIndex = 0;
  var lastPageTurn = 0;
  var swipeStartX = 0;
  var swipeStartY = 0;
  var touchLastY = 0;
  var swipeTracking = false;
  var visualRenderId = 0;
  var IMAGE_CACHE_VERSION = "20260805-content5";
  var imagePreloadCache = new Map();
  var SWIPE_THRESHOLD = 48;
  var SWIPE_MAX_VERTICAL = 72;

  var projects = [
    {
      year: "2025",
      title: "Waiting For You",
      subtitle: "Narrative Adventure Game",
      variant: "confidentiality",
      intro: "",
      caseStudy: "",
      role: "",
      tools: "",
      outcome: "",
      visual: "./assets/p2/indiegame/indie_01.webp",
      pages: [
        {
          label: "项目概览",
          header: "2026 | Waiting For You\n2026 | 独立游戏",
          title: "Waiting For You",
          subtitle: "Narrative Adventure Game",
          visual: "./assets/p2/indiegame/indie_01.webp",
          body: "游戏简介\n\n《Waiting For You》（暂定名）是一款温暖治愈的叙事冒险游戏。\n玩家将扮演一名成长中的女孩，与一只陪伴自己多年的喜乐蒂犬共同经历童年、青春与成年后的重要人生片段。\n通过探索、互动与轻度解谜，玩家将逐渐拼凑记忆中的故事，在陪伴与告别之间重新理解爱、成长与等待的意义。\n\n核心玩法\n* 剧情驱动叙事体验\n* 场景探索与环境互动\n* 轻度解谜与收集\n* 多章节人生回忆\n* 宠物陪伴互动系统\n* 情感选择与记忆拼图\n\n项目状态\n独立开发中\n预计于 2026 年底登陆 Steam\n\nOverview\n\nWaiting For You (working title) is a narrative adventure game about companionship, memory, and growing up.\nPlayers follow the journey of a young woman and her beloved Shetland Sheepdog through different stages of life. By exploring memories, interacting with the environment, and solving light puzzles, players gradually uncover a heartfelt story about love, loss, waiting, and the bonds that remain with us forever.\n\nCore Gameplay\n* Story-driven narrative experience\n* Environmental exploration\n* Light puzzle solving\n* Multi-chapter memory journey\n* Companion interaction system\n* Emotional storytelling and memory collection\n\nDevelopment Status\nCurrently in development.\nPlanned for release on Steam in late 2026."
        }
      ]
    },
    {
      year: "2025",
      title: "外包合作",
      subtitle: "指环王手机版",
      variant: "confidentiality",
      intro: "节选已上线项目内容，部分信息因保密要求已做处理。\n\nSelected from a launched project; some details are adjusted for confidentiality.",
      caseStudy: "",
      role: "",
      tools: "",
      outcome: "",
      visual: "./assets/p2/waibao/waibao_01.webp",
      collapsibleSections: true,
      pages: [
        {
          label: "01｜任务系统 UI 规范：从策划需求到适配交付",
          header: "01｜外包交付：任务系统 UI 规范与适配设计\n01｜Outsourcing Delivery: Task System UI Guidelines & Adaptation",
          title: "将策划需求转化为可复用、可落地的任务系统规范\nTurn requirements into reusable UI guidelines",
          subtitle: "节选已上线项目内容，部分信息因保密要求已做处理。\nSelected from a launched project; some details are adjusted for confidentiality.",
          visual: "./assets/p2/waibao/waibao_01.webp",
          body: "在外包合作项目《指环王》中，我负责将策划需求拆解为可执行的 UI 规则，并输出任务结构、页面状态、奖励展示、按钮逻辑、横竖屏适配与研发标注说明。\nIn this outsourcing project, I translated requirements into executable UI rules, including task structure, page states, rewards, button logic, screen adaptation, and dev notes.\n\n项目重点不只是完成单页设计，而是确保不同任务类型、不同阶段状态和不同设备比例下，界面都能稳定复用并准确落地。\nThe goal was not just one-page design, but stable reuse and delivery across task types, states, and screen ratios.\n\n设计拆解\nDesign Breakdown\n\n01｜任务结构拆解\n01｜Task Structure\n\n梳理主线任务、支线任务、阶段任务、子任务之间的层级关系，明确不同任务类型在页面中的展示位置与跳转逻辑。\nClarified the hierarchy of main tasks, side tasks, stages, and subtasks, including layout position and navigation logic.\n\n02｜多状态规则定义\n02｜State Rules\n\n针对进行中、未解锁、已完成、可领取、已领取等状态，定义按钮、红点、奖励、锁定态和缺省页表现，避免状态切换时出现理解偏差。\nDefined buttons, red dots, rewards, locked states, and empty states for in-progress, locked, completed, claimable, and claimed tasks.\n\n03｜横竖屏适配规范\n03｜Portrait & Landscape Adaptation\n\n根据横版与竖版页面差异，制定任务列表、详情区域、奖励模块和操作按钮的排布规则，保证同一套内容在不同设备方向下都能稳定展示。\nSet layout rules for task lists, details, rewards, and buttons to keep content stable in both portrait and landscape.\n\n04｜研发交付说明\n04｜Development Notes\n\n补充字体字号、文本截断、最大宽度、按钮状态、资源命名和动效说明，让设计方案能够被研发和外包团队准确执行。\nAdded notes for font size, truncation, max width, button states, asset naming, and animations for accurate execution.\n\n结论\n\n该项目的核心价值，是将分散的策划需求整理为一套可复用、可适配、可研发落地的任务系统 UI 规范。\nThe value was turning scattered requirements into a reusable, adaptable, and dev-ready UI guideline."
        },
        {
          label: "02｜多阶段任务设计：状态流转与研发落地规则",
          header: "02｜状态设计：多阶段任务的流转与展示规则\n02｜State Design: Multi-stage Task Flow & Display Rules",
          title: "让复杂任务状态在不同阶段中清晰切换\nMake complex task states clear across stages",
          subtitle: "节选已上线项目内容，部分信息因保密要求已做处理。\nSelected from a launched project; some details are adjusted for confidentiality.",
          visual: "./assets/p2/waibao/waibao_02.webp",
          body: "多阶段任务相比单阶段任务，需要同时处理阶段进度、子任务目标、奖励领取、按钮状态和完成后的后续任务展示。\nMulti-stage tasks need to handle progress, subgoals, rewards, button states, and follow-up tasks at the same time.\n\n因此，我将任务页面拆解为「任务列表、子任务详情、奖励展示、操作按钮、缺省状态」几个模块，并为每个模块定义对应的展示规则与适配方式。\nSo I split the page into task list, subtask details, rewards, action buttons, and empty states, with rules for each module.\n\n关键方案\nKey Solutions\n\n01｜单阶段 / 多阶段任务区分\n01｜Single-stage / Multi-stage Tasks\n\n单阶段任务直接展示任务目标、奖励与前往按钮；多阶段任务增加阶段进度，并在当前阶段完成后切换至下一阶段内容，避免玩家误解任务进度。\nSingle-stage tasks show goals, rewards, and action buttons directly; multi-stage tasks add progress and switch to the next stage after completion.\n\n02｜奖励展示规则\n02｜Reward Display Rules\n\n奖励模块按品质、道具图标、数量和文本说明组合展示。\nRewards are displayed by quality, item icon, quantity, and text.\n\n对于多阶段任务，奖励根据当前阶段切换，保证玩家看到的是当前可获得内容。\nFor multi-stage tasks, rewards update by stage so players see what they can currently earn.\n\n03｜按钮状态规则\n03｜Button State Rules\n\n按钮根据任务状态区分为前往、领取、已领取、未解锁等表现。\nButtons change by task state: Go, Claim, Claimed, Locked.\n\n当任务不可操作时，通过锁定或缺省状态提示，降低误触和误解。\nWhen unavailable, locked or empty states reduce misclicks and confusion.\n\n04｜缺省页与引导状态\n04｜Empty States & Guidance\n\n当当前页面无可显示任务时，使用通用缺省页承接状态，并通过页签或引导提示帮助玩家回到可操作任务列表。\nWhen no task is available, a general empty state guides players back to actionable task lists.\n\n05｜文本与资源适配\n05｜Text & Asset Adaptation\n\n针对任务标题、目标描述、奖励数量等内容，定义最大宽度、换行、省略和缩字号规则，保证不同文案长度下页面仍能稳定展示。\nSet rules for max width, wrapping, ellipsis, and font scaling to keep layouts stable with different text lengths.\n\n结论\n\n通过状态流转、适配规则和交付标注，该项目保证了多阶段任务在不同内容长度、不同任务状态和不同屏幕比例下都能清晰展示、稳定落地。\nWith state flow, adaptation rules, and dev notes, multi-stage tasks stay clear and stable across text lengths, states, and screen ratios."
        }
      ]
    },
    {
      year: "2025",
      title: "reva",
      subtitle: "reva",
      variant: "confidentiality",
      intro: "项目内容暂以占位素材展示。\n\n该页面沿用 Blood Message 的详情排版结构，左侧使用静态项目预览图，右侧展示项目标题与简短说明。",
      caseStudy: "",
      role: "",
      tools: "",
      outcome: "",
      visual: "./assets/p2/reva/reva_01.webp",
      collapsibleSections: true,
      pages: [
        {
          label: "项目概述：AI 复古梦核相机概念设计",
          header: "01｜项目概述：AI 复古梦核相机概念设计\n01｜Overview: AI Retro Dreamcore Camera Concept",
          title: "用 AI 把日常照片转化为更有情绪感的复古梦核影像\nTurn everyday photos into emotional retro dreamcore visuals with AI",
          subtitle: "概念项目，聚焦 AI 图像风格化、复古相机体验与年轻用户影像表达需求。\nA concept project exploring AI image stylization, retro camera experience, and young users' visual expression needs.",
          visual: "./assets/p2/reva/reva_01.webp",
          body: "REVACAM 是一款面向年轻用户的 AI 风格化相机概念产品。\nREVACAM is an AI-powered stylized camera concept designed for young users.\n\n它聚焦复古胶片、梦核视觉与 AI 图像重构体验，希望让用户不只是“拍一张好看的照片”，而是把日常照片转化为更具情绪、叙事和社交分享价值的影像内容。\nIt focuses on retro film aesthetics, dreamcore visuals, and AI image reconstruction, helping users turn everyday photos into images with stronger emotion, narrative, and social sharing value.\n\n项目目标不是单纯叠加滤镜，而是探索 AI 如何参与用户的影像创作过程：从照片识别、风格推荐，到梦核视觉重构，让普通照片也能获得更完整的氛围表达。\nThe goal is not simply to add filters, but to explore how AI can support the image creation process, from photo recognition and style recommendation to dreamcore visual reconstruction.\n\n设计拆解\nDesign Breakdown\n\n01｜产品定位\n01｜Product Positioning\n\nREVACAM 定位为一款 AI 复古梦核相机，结合胶片质感、复古影像语言与 AI 风格化生成能力。\nREVACAM is positioned as an AI retro dreamcore camera that combines film texture, vintage visual language, and AI-powered stylized generation.\n\n02｜用户价值\n02｜User Value\n\n用户可以通过 AI 将普通照片转化为更具氛围、记忆感和表达性的视觉内容。\nUsers can transform ordinary photos into more atmospheric, memorable, and expressive visual content through AI.\n\n03｜设计目标\n03｜Design Goal\n\n让 AI 不只是提供效果，而是帮助用户降低创作门槛、增强照片情绪表达，并提升内容的分享价值。\nThe design goal is to make AI not only provide effects, but also lower the creative barrier, strengthen emotional expression, and increase the sharing value of visual content.\n\n结论\nConclusion\n\nREVACAM 试图回答的问题是：当 AI 进入摄影工具后，用户如何从“使用滤镜”进一步走向“创作影像氛围”。\nREVACAM explores how users can move from simply “using filters” to actively creating visual atmosphere when AI becomes part of the camera experience."
        },
        {
          label: "调研洞察：复古相机趋势与用户需求",
          header: "02｜调研洞察：复古相机趋势与用户需求\n02｜Research Insight: Retro Camera Trends & User Needs",
          title: "用户需要的不只是滤镜，而是能表达情绪的影像工具\nUsers need more than filters; they need tools for emotional visual expression",
          subtitle: "基于复古相机 App 趋势、竞品分析与用户拍摄场景研究，提炼年轻用户对 AI 影像工具的核心需求。\nBased on retro camera app trends, competitor analysis, and user shooting scenarios, this section identifies young users' key needs for AI-powered image tools.",
          visual: "./assets/p2/reva/reva_02.webp",
          body: "从近年复古相机与胶片 App 的流行趋势来看，年轻用户对“低成本获得氛围感影像”的需求正在持续增长。\nRecent trends in retro camera and film-style apps show that young users increasingly want to create atmospheric images with low effort.\n\n我分析了 DAZZ、Fomz、OldRoll 等产品，发现它们大多围绕胶片模拟、相机拟物、复古质感和即时成片体验展开。\nI analyzed products such as DAZZ, Fomz, and OldRoll, and found that most of them focus on film simulation, skeuomorphic camera interaction, retro textures, and instant visual results.\n\n但在用户访谈和使用场景梳理中，我发现用户真正想要的并不只是“照片变好看”，而是让照片更能表达当下的情绪、记忆和个人审美。\nHowever, through user interviews and scenario analysis, I found that users do not only want photos to look better. They want photos to express mood, memory, and personal taste.\n\n调研洞察\nResearch Insights\n\n01｜情绪表达需求\n01｜Need for Emotional Expression\n\n用户希望照片不仅是好看，而是能传达某种氛围、情绪或故事感。\nUsers want photos to communicate atmosphere, emotion, or a sense of story, rather than simply look good.\n\n02｜AI 接受度与控制感\n02｜AI Acceptance & Sense of Control\n\n用户愿意接受 AI 推荐和自动生成效果，但不希望完全失去个人选择权。\nUsers are open to AI recommendations and automated results, but they do not want to lose personal control.\n\n03｜轻创作场景集中\n03｜Light Creative Scenarios\n\n用户的主要拍摄场景集中在街头、人像、静物、美食、旅行记录等轻创作场景。\nCommon shooting scenarios include street photography, portraits, still life, food, travel, and other light creative moments.\n\n04｜选择成本问题\n04｜Decision Cost\n\n当滤镜数量过多时，用户容易陷入反复试错，难以快速判断哪种风格最适合当前照片。\nWhen there are too many filters, users often fall into trial and error and struggle to choose the right style quickly.\n\n结论\nConclusion\n\n调研结果表明，REVACAM 的机会不在于提供更多滤镜，而在于用 AI 帮助用户更快找到适合照片情绪的视觉表达方式。\nThe research shows that REVACAM's opportunity is not to provide more filters, but to help users find the right visual expression for each photo's mood through AI."
        },
        {
          label: "设计策略：情绪回溯与 AI 辅助创作",
          header: "03｜设计策略：情绪回溯与 AI 辅助创作\n03｜Design Strategy: Emotional Rewind & AI-assisted Creation",
          title: "让 AI 降低选择成本，同时保留用户的创作控制感\nUse AI to reduce decision cost while preserving creative control",
          subtitle: "基于用户洞察，将产品体验拆解为情绪表达、AI 分层操作与滤镜决策辅助三条设计策略。\nBased on user insights, the product experience is structured around emotional expression, layered AI interaction, and filter decision support.",
          visual: "./assets/p2/reva/reva_03.webp",
          body: "基于调研，我将 REVACAM 的体验策略拆分为三层：情绪回溯、分层式 AI 体验和决策减负。\nBased on the research, I structured REVACAM's experience strategy into three layers: emotional rewind, layered AI experience, and decision support.\n\n用户可以用梦核、复古、胶片等视觉语言重新包装日常记忆，让普通照片获得更强的情绪氛围。\nUsers can reframe everyday memories through dreamcore, retro, and film-inspired visual languages, giving ordinary photos a stronger emotional atmosphere.\n\n同时，AI 不直接替代用户创作，而是在推荐、生成和参数调节中提供辅助，让不同熟练度的用户都能找到适合自己的使用方式。\nAt the same time, AI does not replace user creativity. It supports users through recommendation, generation, and adjustable parameters, allowing both basic and advanced users to work in their preferred way.\n\n设计策略\nDesign Strategy\n\n01｜情绪回溯\n01｜Emotional Rewind\n\n通过复古胶片、梦核视觉和低保真影像质感，让照片从“记录现实”转向“重构记忆”。\nThrough retro film, dreamcore visuals, and lo-fi image textures, photos shift from recording reality to reconstructing memory.\n\n02｜分层式 AI 体验\n02｜Layered AI Experience\n\n基础用户可以一键生成完整风格效果，高阶用户可以继续调节滤镜、风格强度、参数和输出格式。\nBasic users can generate a complete stylized result with one tap, while advanced users can further adjust filters, style intensity, parameters, and output formats.\n\n03｜AI 决策减负\n03｜AI-assisted Decisions\n\nAI 根据照片内容、光线、场景和情绪倾向推荐合适滤镜，减少用户在大量滤镜中反复试错的成本。\nAI recommends suitable filters based on photo content, lighting, scene, and emotional tone, reducing the cost of trial and error.\n\n04｜信息架构\n04｜Information Architecture\n\n产品结构围绕拍摄、导入、AI 推荐、风格生成、参数调整、保存分享和社区发布展开，形成完整创作链路。\nThe product structure covers shooting, importing, AI recommendation, style generation, parameter adjustment, saving, sharing, and community publishing, forming a complete creation flow.\n\n结论\nConclusion\n\n设计策略的核心，是让 AI 成为用户创作过程中的“辅助判断者”，而不是完全替用户做决定。\nThe core strategy is to make AI an assistant in the creative process, rather than a system that makes every decision for the user."
        },
        {
          label: "核心功能：AI 梦核重构与创作者生态",
          header: "04｜核心功能：AI 梦核重构与创作者生态\n04｜Core Features: AI Dreamcore Reconstruction & Creator Ecosystem",
          title: "从一张照片开始，生成、调节并分享个人化视觉风格\nGenerate, adjust, and share personalized visual styles from a single photo",
          subtitle: "围绕 AI 梦核重构、AI-LUT 智能推荐与创作者生态，形成从照片生成到风格分享的完整产品闭环。\nThe final solution centers on AI dreamcore reconstruction, AI-LUT recommendation, and a creator ecosystem, forming a complete loop from image generation to style sharing.",
          visual: "./assets/p2/reva/reva_04.webp",
          body: "最终方案围绕三个核心功能展开：AI 梦核重构、AI-LUT 智能推荐和创作者生态。\nThe final solution is built around three core features: AI dreamcore reconstruction, AI-LUT recommendation, and a creator ecosystem.\n\n用户可以拍摄或上传照片，由 AI 识别画面主体、时代感、服装、场景和情绪，并将现实照片重构为具有梦核氛围的视觉作品。\nUsers can take or upload a photo, and AI identifies the subject, era, clothing, scene, and emotional tone to reconstruct the image into a dreamcore-style visual work.\n\n同时，系统会根据照片光线、色彩、构图和拍摄场景推荐合适的 LUT 与滤镜风格，帮助用户快速获得稳定效果。\nAt the same time, the system recommends suitable LUTs and filter styles based on lighting, color, composition, and shooting scenario, helping users quickly achieve stable results.\n\n核心功能\nCore Features\n\n01｜AI 梦核重构\n01｜AI Dreamcore Reconstruction\n\n用户上传或拍摄照片后，AI 识别画面中的人物、场景、服装、光线和情绪倾向，并生成具有复古梦核氛围的影像结果。\nAfter users upload or take a photo, AI recognizes the subject, scene, clothing, lighting, and emotional tone, then generates a retro dreamcore-style image.\n\n02｜AI-LUT 智能推荐\n02｜AI-LUT Smart Recommendation\n\n系统根据照片内容自动推荐适合的滤镜和 LUT，降低用户在大量风格中选择的成本。\nThe system automatically recommends suitable filters and LUTs based on photo content, reducing the effort required to choose among many styles.\n\n03｜可调节生成流程\n03｜Adjustable Generation Flow\n\n用户可以在 AI 生成结果基础上继续调整风格强度、色彩倾向、颗粒感、边框和输出比例。\nUsers can further adjust style intensity, color tone, grain, borders, and output ratio based on the AI-generated result.\n\n04｜创作者生态\n04｜Creator Ecosystem\n\n用户不仅可以使用滤镜，也可以发布自己的滤镜预设、风格作品和生成模板，形成从使用到创作的社区闭环。\nUsers can not only use filters, but also publish their own presets, visual styles, and generation templates, creating a community loop from use to creation.\n\n设计价值\nDesign Value\n\nREVACAM 通过 AI 降低用户的创作门槛，同时保留调节空间与个人表达，让复古相机从“滤镜工具”转变为“情绪影像创作平台”。\nREVACAM lowers the creative barrier through AI while preserving room for adjustment and personal expression, turning a retro camera from a filter tool into an emotional visual creation platform."
        }
      ]
    },
    {
      year: "2024",
      title: "Blood Message",
      subtitle: "Linear Action-Adventure Title",
      variant: "confidentiality",
      intro: "NetEase Games and 24 Entertainment Lin'an Studio have announced a brand new linear action-adventure title, Blood Message, set in Ancient China.\n\nAs the project has not yet been released, detailed design materials, workflows, and production assets cannot be shared due to NDA and IP protection requirements.\n\n网易游戏与24 Entertainment临安工作室联合公布了全新线性动作冒险游戏《归唐》（Blood Message）。\n\n由于项目尚未正式上线，受保密协议（NDA）及知识产权保护要求限制，暂不展示具体设计方案、制作流程及相关资产。",
      caseStudy: "Detailed case study is confidential until official release.",
      role: "Public preview only",
      tools: "Protected by NDA and IP requirements",
      outcome: "Full production materials are not available for public display.",
      pages: [
        {
          label: "项目概览",
          header: "2024 | Blood Message\n2024 | 归唐",
          title: "Blood Message",
          subtitle: "Linear Action-Adventure Title",
          videoEmbed: "https://www.youtube.com/embed/n6IwsMWTVGI?rel=0&modestbranding=1",
          body: "NetEase Games and 24 Entertainment Lin'an Studio have announced a brand new linear action-adventure title, Blood Message, set in Ancient China.\n\nAs the project has not yet been released, detailed design materials, workflows, and production assets cannot be shared due to NDA and IP protection requirements.\n\n网易游戏与24 Entertainment临安工作室联合公布了全新线性动作冒险游戏《归唐》（Blood Message）。\n\n由于项目尚未正式上线，受保密协议（NDA）及知识产权保护要求限制，暂不展示具体设计方案、制作流程及相关资产。"
        }
      ]
    },
    {
      year: "2019",
      title: "三国志·战略版 / ROMANCE OF THE THREE KINGDOMS Mobile",
      subtitle: "The romance of Three Kingdom Mobile",
      intro: "为策略战争题材建立厚重、秩序化的视觉展示节奏。",
      caseStudy: "以历史战争题材为核心，梳理项目图片、文字层级与时间轴中的视觉权重。",
      role: "Campaign Visual / Layout Design",
      tools: "Photoshop / Figma",
      outcome: "将项目资产整合为更具史诗感和识别度的作品节点。",
      visual: "./assets/p2/p2_002.webp",
      visualNav: true,
      sections: [
        {
          label: "产品设计",
          labelEn: "Product Design",
          icon: "product-design",
          pages: [
            {
              label: "01｜项目概览：SLG 赛事系统体验设计",
              header: "01｜项目概览：SLG 赛事系统体验设计\n01｜Project Overview: SLG Tournament System Experience Design",
              title: "从规则理解到战斗复盘，搭建完整赛事体验闭环\nBuild a complete tournament experience loop from rule understanding to battle review",
              subtitle: "",
              visual: "./assets/p2/sanguo/longhu/slg_01.webp",
              body: "项目信息\nProject Info\n\n项目类型：SLG 赛事系统 / 复杂玩法设计 / 战斗体验优化\nType: SLG Tournament System / Complex Gameplay Design / Battle Experience Optimization\n\n项目职责：系统体验设计、信息架构、赛事流程梳理、界面方案设计、战斗与复盘体验优化\nRole: System Experience Design / Information Architecture / Tournament Flow Mapping / UI Design / Battle & Review Optimization\n\n项目范围：赛事入口、规则说明、报名参赛、赛前准备、战斗界面、指挥协作、战报复盘、奖励反馈\nScope: Tournament Entry / Rules / Registration / Preparation / Battle Interface / Command & Collaboration / Battle Review / Rewards\n\n项目状态：核心系统设计已完成\nStatus: Core system design completed\n\n这是一项围绕 SLG 赛事玩法展开的核心系统设计项目。\nThis is a core system design project focused on SLG tournament gameplay.\n\n项目并不是单纯设计赛事页面，而是需要将复杂的赛事规则、报名机制、战斗流程、角色职责和赛后复盘整合进一套可理解、可操作、可持续参与的体验链路中。\nThe goal was not simply to design tournament pages, but to integrate complex rules, registration, battle flow, role responsibilities, and post-battle review into a clear and actionable experience journey.\n\n在项目中，我负责从玩法规则理解出发，梳理玩家在赛前、赛中和赛后的完整路径，并针对指挥者、团员、观战者等不同角色拆解信息需求，最终完成赛事入口、报名引导、战场界面、战报复盘和奖励反馈等关键模块设计。\nIn this project, I started from gameplay rule analysis, mapped the full player journey before, during, and after the tournament, and broke down information needs for different roles such as commanders, members, and spectators. I then designed key modules including tournament entry, registration guidance, battlefield interface, battle review, and reward feedback.\n\n项目核心\nCore Focus\n\n将复杂赛事系统从「规则堆叠」转化为「玩家能够理解、参与、协作和复盘的完整体验」。\nTurn a complex tournament system from a stack of rules into a complete experience that players can understand, join, collaborate in, and review.\n\nSLG 赛事玩法具有高信息密度和高参与门槛。玩家不仅需要知道赛事什么时候开始、如何报名、能获得什么奖励，还需要在战斗中快速判断局势、理解自身任务，并在战斗结束后通过数据复盘胜负原因。\nSLG tournament gameplay is information-heavy and has a high participation threshold. Players need to know when the event starts, how to register, and what rewards they can get, while also judging the battle situation during combat and reviewing the result afterward.\n\n因此，本项目的设计重点不是增加更多信息，而是重新组织信息层级，让玩家在不同阶段都能快速知道：我现在处于什么状态、我下一步该做什么、这场战斗为什么会这样。\nTherefore, the design focus was not to add more information, but to reorganize information hierarchy so players could quickly understand their current stage, next action, and battle outcome.\n\n设计拆解\nDesign Breakdown\n\n01｜赛前理解\n01｜Pre-match Understanding\n\n帮助玩家快速理解赛事规则、报名条件、比赛时间、参与方式和奖励价值。\nHelp players quickly understand rules, registration conditions, match time, participation method, and reward value.\n\n02｜赛中协作\n02｜In-battle Collaboration\n\n围绕战场局势、目标点、队友状态和个人任务，帮助玩家在高压战斗中完成判断和行动。\nSupport players in judging and acting during high-pressure battles through battlefield status, objectives, teammate states, and personal tasks.\n\n03｜赛后复盘\n03｜Post-battle Review\n\n通过战报、贡献、战损、奖励和数据对比，让玩家理解结果并形成下一次参与动力。\nUse reports, contribution, losses, rewards, and data comparison to help players understand the result and stay motivated for future participation.\n\n结论\nConclusion\n\n本项目最终形成了一套覆盖赛前、赛中和赛后的赛事体验框架，让赛事系统不只是一个活动入口，而是一条完整的参与与复盘链路。\nThe project created a tournament experience framework covering pre-match, in-battle, and post-battle stages, turning the tournament system from an event entry into a complete participation and review loop.\n\n核心表达\nKey Sentence\n\n一个好的 SLG 赛事系统，不只是告诉玩家「比赛开始了」，而是帮助玩家理解规则、完成协作，并在战斗后知道自己为什么赢或输。\nA good SLG tournament system does not just tell players that a match has started; it helps them understand the rules, collaborate in battle, and learn why they won or lost."
            },
            {
              label: "02｜设计挑战：复杂规则如何被玩家理解",
              header: "02｜设计挑战：复杂规则如何被玩家理解\n02｜Design Challenge: Making Complex Rules Understandable",
              title: "把高门槛赛事规则，转化为清晰的参与路径\nTurn high-threshold tournament rules into a clear participation path",
              subtitle: "",
              visual: "./assets/p2/sanguo/longhu/slg_02.webp",
              body: "项目信息\nProject Info\n\n项目类型：规则理解 / 信息架构 / 赛事路径拆解\nType: Rule Understanding / Information Architecture / Tournament Journey Mapping\n\n项目职责：规则梳理、用户路径拆解、信息优先级判断、体验问题定位\nRole: Rule Mapping / User Journey Breakdown / Information Priority / Experience Issue Definition\n\n项目范围：赛事规则、报名资格、阶段状态、奖励说明、赛前引导、玩家参与路径\nScope: Tournament Rules / Registration Eligibility / Stage Status / Reward Explanation / Pre-match Guidance / Player Journey\n\n项目状态：已完成规则拆解与信息结构整理\nStatus: Rule breakdown and information structure completed\n\nSLG 赛事系统的难点在于，它同时包含报名条件、参赛资格、阵营分配、战斗规则、积分机制、奖励机制和战报复盘等多层信息。\nThe challenge of an SLG tournament system is that it contains multiple layers of information, including registration conditions, eligibility, faction assignment, battle rules, scoring, rewards, and battle review.\n\n对于玩家来说，真正的问题并不是「页面里有没有规则」，而是他们是否能在正确的时间看到正确的信息。\nFor players, the real issue is not whether the rules exist on the page, but whether they can see the right information at the right time.\n\n玩家需要快速判断自己现在处在哪个赛事阶段，是否具备参赛资格，下一步应该报名、备战、进入战场，还是等待结果。\nPlayers need to quickly understand which stage they are in, whether they are eligible, and whether they should register, prepare, enter the battlefield, or wait for results.\n\n因此，我首先将赛事体验拆分为赛前理解、赛中协作和赛后复盘三个阶段，并基于不同阶段重新整理信息优先级。\nTherefore, I first divided the tournament experience into three stages: pre-match understanding, in-battle collaboration, and post-battle review, then reorganized information priority for each stage.\n\n项目核心\nCore Focus\n\n玩家真正需要的不是完整阅读所有规则，而是快速知道「我能不能参加、现在该做什么、参与后能得到什么」。\nPlayers do not need to read every rule in full; they need to quickly know whether they can join, what to do next, and what they can get.\n\n赛事信息如果全部堆叠在同一层级，玩家会在报名、备战和参赛过程中不断产生疑问。\nIf tournament information is stacked on the same level, players will keep feeling uncertain during registration, preparation, and participation.\n\n所以设计的第一步，是将规则从长文本说明转化为阶段化、状态化和任务化的信息结构。\nThe first design step was to transform rules from long text explanations into staged, status-based, and task-based information structures.\n\n设计拆解\nDesign Breakdown\n\n01｜阶段状态清晰化\n01｜Clarify Stage Status\n\n将赛事拆分为预告、报名、备战、开战、结算等阶段，让玩家快速知道当前赛事进度。\nBreak the tournament into stages such as preview, registration, preparation, battle, and settlement, helping players quickly understand the current progress.\n\n02｜参与条件前置\n02｜Prioritize Participation Conditions\n\n将报名资格、参赛限制、阵营条件和队伍要求放在玩家决策前置位置，减少报名失败后的挫败感。\nPlace eligibility, restrictions, faction conditions, and team requirements before the decision point to reduce frustration after failed registration.\n\n03｜奖励价值明确化\n03｜Clarify Reward Value\n\n突出赛事奖励、排名奖励和阶段奖励，让玩家理解参与赛事的收益。\nHighlight tournament rewards, ranking rewards, and stage rewards so players can understand the value of participation.\n\n04｜下一步行动提示\n04｜Guide the Next Action\n\n根据当前阶段提供明确按钮和状态反馈，例如报名、查看规则、进入战场、查看战报或领取奖励。\nProvide clear buttons and status feedback based on the current stage, such as register, view rules, enter battlefield, view report, or claim rewards.\n\n结论\nConclusion\n\n通过对赛事规则进行阶段化和任务化整理，玩家不需要完整阅读复杂说明，也可以判断自己当前所处状态和下一步行动。\nBy organizing tournament rules into stages and tasks, players can understand their current status and next action without reading complex rule descriptions in full.\n\n核心表达\nKey Sentence\n\n赛事规则不应该只是被展示出来，而应该被转译成玩家在每个阶段都能理解的行动提示。\nTournament rules should not only be displayed; they should be translated into action guidance that players can understand at every stage."
            },
            {
              label: "03｜核心方案：多角色赛事路径设计",
              header: "03｜核心方案：多角色赛事路径设计\n03｜Core Solution: Multi-role Tournament Journey Design",
              title: "围绕指挥、团员与观战者，建立不同的信息优先级\nBuild different information priorities for commanders, members, and spectators",
              subtitle: "",
              visual: "./assets/p2/sanguo/longhu/slg_03.webp",
              body: "项目信息\nProject Info\n\n项目类型：多角色体验设计 / 玩家路径设计 / 赛事协作系统\nType: Multi-role Experience Design / Player Journey Design / Tournament Collaboration System\n\n项目职责：角色需求拆解、路径设计、信息层级规划、协作体验设计\nRole: Role Need Breakdown / Journey Design / Information Hierarchy Planning / Collaboration Experience Design\n\n项目范围：指挥视角、团员视角、观战视角、团队协作、目标引导、状态反馈\nScope: Commander View / Member View / Spectator View / Team Collaboration / Objective Guidance / Status Feedback\n\n项目状态：已完成核心角色路径与界面信息规划\nStatus: Core role journeys and interface information planning completed\n\n赛事系统并不是所有玩家都以同一种方式参与。\nNot all players participate in a tournament system in the same way.\n\n在同一场赛事中，指挥者需要关注全局局势、目标点、队伍调度和阶段策略；普通团员更关注自己当前能做什么、该去哪里、是否完成任务；观战或复盘玩家则更关注战局变化、关键节点、结果数据和胜负原因。\nIn the same tournament, commanders need to focus on the overall situation, objectives, team dispatch, and stage strategy; ordinary members care more about what they can do now, where they should go, and whether their tasks are completed; spectators or review players focus on battle changes, key moments, result data, and reasons behind victory or defeat.\n\n因此，我没有将赛事界面设计成单一的信息面板，而是根据不同角色的参与深度，拆分出对应的信息层级与操作重点。\nTherefore, I did not design the tournament interface as a single information panel. Instead, I separated information hierarchy and operation focus based on each role's level of participation.\n\n项目核心\nCore Focus\n\n同一套赛事系统，需要同时服务「全局决策者」和「即时执行者」。\nThe same tournament system needs to serve both global decision-makers and immediate action-takers.\n\n如果界面只强调全局信息，普通团员会不知道自己该做什么；如果界面只强调个人任务，指挥者又难以判断整体局势。\nIf the interface only emphasizes global information, ordinary members may not know what to do. If it only emphasizes personal tasks, commanders may struggle to judge the overall situation.\n\n所以设计重点是让不同角色都能看到自己最需要的信息，同时保持赛事系统整体的一致性。\nThe design focus was to let each role see the information they need most while keeping the whole tournament system consistent.\n\n设计拆解\nDesign Breakdown\n\n01｜指挥视角\n01｜Commander View\n\n指挥者需要快速掌握全局战况，因此信息重点放在地图、据点状态、敌我兵力、队伍分布和阶段目标上。\nCommanders need to quickly understand the overall battle situation, so the key information includes map status, objective points, enemy and ally forces, team distribution, and stage goals.\n\n界面需要帮助指挥者判断哪里需要支援、哪里正在交战、下一阶段应该推进还是防守。\nThe interface should help commanders judge where support is needed, where battles are happening, and whether the next stage should focus on attack or defense.\n\n02｜团员视角\n02｜Member View\n\n普通团员更需要明确当前任务和即时反馈，例如前往哪个目标点、是否可以参与战斗、是否完成了阶段贡献。\nOrdinary members need clear current tasks and immediate feedback, such as which objective to go to, whether they can join the battle, and whether they have completed their stage contribution.\n\n界面需要减少理解成本，让团员不用反复询问指挥，也能完成基本行动。\nThe interface should reduce cognitive cost so members can act without repeatedly asking commanders.\n\n03｜观战视角\n03｜Spectator View\n\n观战者更关注战局走势和关键节点，因此需要清晰呈现双方状态、地图变化和阶段结果。\nSpectators care more about battle flow and key moments, so the interface needs to clearly show both sides' status, map changes, and stage results.\n\n观战信息不需要提供过多操作，但需要帮助玩家理解当前战况。\nSpectator information does not need too many actions, but it should help players understand the current situation.\n\n04｜复盘视角\n04｜Review View\n\n赛后玩家需要通过战报、数据和贡献信息理解胜负原因，因此需要将结果、过程和个人表现拆分展示。\nAfter the battle, players need to understand why they won or lost through reports, data, and contribution information, so the result, process, and personal performance should be displayed separately.\n\n复盘信息既要支持普通玩家快速看结果，也要支持深度玩家分析细节。\nReview information should support both casual players who only need quick results and advanced players who want deeper analysis.\n\n结论\nConclusion\n\n通过多角色路径拆解，赛事系统从单一活动页面转化为一个能够支持指挥、执行、观战和复盘的完整协作系统。\nThrough multi-role journey design, the tournament system was transformed from a single event page into a complete collaboration system supporting command, execution, spectating, and review.\n\n核心表达\nKey Sentence\n\n复杂赛事体验的关键，不是让所有玩家看到同样的信息，而是让每个角色都能快速看到自己最需要的信息。\nThe key to a complex tournament experience is not showing the same information to every player, but helping each role quickly see what they need most."
            },
            {
              label: "04｜界面落地：战斗信息与操作反馈设计",
              header: "04｜界面落地：战斗信息与操作反馈设计\n04｜Interface Design: Battle Information and Action Feedback",
              title: "让玩家在高压战斗中快速判断局势，并完成下一步操作\nHelp players judge the battle situation and take the next action under pressure",
              subtitle: "",
              visual: "./assets/p2/sanguo/longhu/slg_04.webp",
              body: "项目信息\nProject Info\n\n项目类型：战斗界面设计 / 信息层级优化 / 操作反馈设计\nType: Battle Interface Design / Information Hierarchy Optimization / Action Feedback Design\n\n项目职责：战场信息组织、目标引导、状态反馈、界面模块设计\nRole: Battlefield Information Organization / Objective Guidance / Status Feedback / Interface Module Design\n\n项目范围：战斗主界面、地图状态、目标点提示、队友协作、敌我信息、即时反馈\nScope: Battle Main Interface / Map Status / Objective Hints / Teammate Collaboration / Enemy-ally Information / Real-time Feedback\n\n项目状态：已完成核心战斗界面设计\nStatus: Core battle interface design completed\n\n赛事战斗阶段的信息压力最高。\nThe battle stage creates the highest information pressure.\n\n玩家需要在有限时间内同时关注地图、队友、敌方、据点、资源、倒计时和任务目标。\nPlayers need to pay attention to the map, teammates, enemies, objectives, resources, countdown, and mission goals within a limited time.\n\n因此，界面设计的重点不是展示尽可能多的信息，而是区分哪些信息需要立刻被看见，哪些信息可以延后查看，哪些信息需要通过状态、颜色、位置和反馈形成快速判断。\nTherefore, the design focus was not to show as much information as possible, but to decide which information should be seen immediately, which can be checked later, and which should support quick judgment through status, color, position, and feedback.\n\n在设计中，我将战斗信息拆分为三类：全局局势、当前目标和即时反馈。\nIn the design, I divided battle information into three categories: overall situation, current objective, and real-time feedback.\n\n项目核心\nCore Focus\n\n战斗界面要帮助玩家快速回答三个问题：现在发生了什么、我应该去哪里、我的操作有没有效果。\nThe battle interface should help players quickly answer three questions: what is happening now, where should I go, and whether my action worked.\n\nSLG 赛事战斗通常具有较强的实时性和协作性。玩家如果需要在多个页面之间切换才能判断局势，就会错过关键操作时机。\nSLG tournament battles are often real-time and collaborative. If players need to switch between multiple pages to judge the situation, they may miss key action timing.\n\n所以战斗界面的信息组织需要更加直接，让关键状态在第一眼就能被识别。\nTherefore, battle information needs to be organized more directly so key states can be recognized at first glance.\n\n设计拆解\nDesign Breakdown\n\n01｜全局局势\n01｜Overall Situation\n\n通过地图、据点状态、敌我分布和阶段提示，帮助玩家快速理解当前战况。\nUse the map, objective status, enemy-ally distribution, and stage prompts to help players quickly understand the battle situation.\n\n玩家不需要阅读大量文字，也可以判断当前是进攻、防守、争夺还是撤退阶段。\nPlayers can judge whether the current stage is attack, defense, contest, or retreat without reading long text.\n\n02｜当前目标\n02｜Current Objective\n\n突出玩家当前应该前往的位置、可执行任务和关键操作，减少迷失感。\nHighlight where the player should go, what task can be done, and what key action is available to reduce confusion.\n\n目标信息需要比普通环境信息更明显，让玩家在战斗中快速建立行动方向。\nObjective information should be more visible than general environment information so players can quickly form an action direction.\n\n03｜即时反馈\n03｜Real-time Feedback\n\n通过状态变化、战斗结果、奖励提示和操作反馈，让玩家确认自己的行为是否有效。\nUse status changes, battle results, reward hints, and action feedback to let players confirm whether their actions are effective.\n\n即时反馈可以降低玩家的不确定感，并强化「我参与了这场战斗」的感受。\nReal-time feedback reduces uncertainty and strengthens the feeling of participation.\n\n04｜信息降噪\n04｜Information Noise Reduction\n\n将低频信息、详细规则和深层数据放入二级层级，避免在战斗主界面中造成干扰。\nMove low-frequency information, detailed rules, and deep data into secondary layers to avoid cluttering the main battle interface.\n\n战斗主界面优先服务判断和行动，而不是完整解释所有规则。\nThe main battle interface should prioritize judgment and action rather than explaining every rule.\n\n结论\nConclusion\n\n通过对战斗信息进行分层处理，界面能够在不增加玩家阅读负担的前提下，帮助玩家快速理解局势、确认目标并完成操作。\nBy layering battle information, the interface helps players understand the situation, confirm objectives, and take action without increasing reading burden.\n\n核心表达\nKey Sentence\n\n战斗界面的价值，不是把所有信息都摆出来，而是在最紧张的时刻告诉玩家「现在最重要的是什么」。\nThe value of a battle interface is not showing all information, but telling players what matters most at the most intense moment."
            },
            {
              label: "05｜复盘闭环：战报、贡献与赛事价值沉淀",
              header: "05｜复盘闭环：战报、贡献与赛事价值沉淀\n05｜Review Loop: Battle Reports, Contribution and Long-term Value",
              title: "用结构化战报与贡献反馈，完成赛事体验闭环\nComplete the tournament loop through structured reports and contribution feedback",
              subtitle: "",
              visual: "./assets/p2/sanguo/longhu/slg_05.webp",
              body: "项目信息\nProject Info\n\n项目类型：战报复盘 / 数据展示 / 奖励反馈 / 长期激励设计\nType: Battle Review / Data Display / Reward Feedback / Long-term Motivation Design\n\n项目职责：战报结构设计、贡献信息整理、结算反馈、复盘路径优化\nRole: Report Structure Design / Contribution Information Mapping / Settlement Feedback / Review Flow Optimization\n\n项目范围：胜负结果、战损战获、个人贡献、团队表现、奖励领取、后续目标\nScope: Win-loss Result / Losses & Gains / Personal Contribution / Team Performance / Reward Claim / Next Goals\n\n项目状态：已完成赛后复盘体验设计\nStatus: Post-battle review experience design completed\n\n赛事体验并不会在战斗结束时停止。\nThe tournament experience does not stop when the battle ends.\n\n对于 SLG 玩家来说，赛后复盘同样重要。玩家需要知道的不只是输赢，还包括为什么赢、为什么输、自己贡献了什么、团队表现如何，以及下一次应该如何调整策略。\nFor SLG players, post-battle review is equally important. Players need to know not only whether they won or lost, but also why, what they contributed, how the team performed, and how they should adjust next time.\n\n因此，我将赛后信息拆分为结果反馈、数据复盘、个人贡献和长期激励四个层级，让玩家能够从战斗结果中获得明确反馈，并形成继续参与赛事的动力。\nTherefore, I divided post-battle information into four layers: result feedback, data review, personal contribution, and long-term motivation, helping players receive clear feedback and stay motivated to participate again.\n\n项目核心\nCore Focus\n\n赛后复盘不是简单结算，而是让玩家理解战斗价值和个人价值。\nPost-battle review is not just settlement; it helps players understand both battle value and personal value.\n\n如果战斗结束后只展示胜负和奖励，玩家很难知道自己在团队中起到了什么作用，也难以从失败中找到调整方向。\nIf the system only shows the result and rewards after battle, players may not understand their role in the team or learn how to adjust after failure.\n\n所以复盘设计需要同时回答结果、原因、贡献和下一步目标。\nTherefore, review design needs to answer result, reason, contribution, and next goal at the same time.\n\n设计拆解\nDesign Breakdown\n\n01｜结果反馈\n01｜Result Feedback\n\n快速告知胜负、排名、积分变化和奖励结果，让玩家第一时间完成结果判断。\nQuickly show win or loss, ranking, score changes, and rewards so players can immediately understand the outcome.\n\n结果信息需要直接明确，避免玩家在复杂数据中寻找最终结论。\nResult information should be direct and clear, so players do not need to search for the final conclusion in complex data.\n\n02｜数据复盘\n02｜Data Review\n\n展示战损、战获、关键战斗数据和敌我对比，帮助玩家理解战斗过程。\nShow losses, gains, key battle data, and enemy-ally comparison to help players understand the battle process.\n\n数据复盘的重点不是堆数字，而是让玩家看出双方差距和关键变化。\nThe focus of data review is not stacking numbers, but showing the gap and key changes between both sides.\n\n03｜个人贡献\n03｜Personal Contribution\n\n突出个人表现、团队贡献和角色价值，增强玩家在赛事中的参与感。\nHighlight personal performance, team contribution, and role value to strengthen the player's sense of participation.\n\n即使玩家不是指挥者，也需要感受到自己的行动对团队结果产生了影响。\nEven if the player is not a commander, they should feel that their actions affected the team result.\n\n04｜长期激励\n04｜Long-term Motivation\n\n通过奖励、排行、阶段目标和下一场赛事提示，推动玩家继续参与后续赛事。\nUse rewards, rankings, stage goals, and next tournament prompts to encourage players to keep participating.\n\n赛事系统需要形成持续参与动力，而不是一次性活动体验。\nThe tournament system should create long-term motivation instead of a one-time event experience.\n\n结论\nConclusion\n\n通过结构化战报与贡献反馈，赛事系统形成了从赛前理解、赛中协作到赛后复盘的完整闭环。\nThrough structured battle reports and contribution feedback, the tournament system formed a complete loop from pre-match understanding to in-battle collaboration and post-battle review.\n\n玩家不仅能够完成赛事参与，也能够理解自己的表现、团队结果和下一步策略方向。\nPlayers can not only participate in the tournament, but also understand their performance, team result, and next strategic direction.\n\n核心表达\nKey Sentence\n\n赛事复盘的意义，不只是告诉玩家「你赢了或输了」，而是帮助玩家理解「你为什么会赢或输，以及下一次可以怎么做」。\nThe meaning of tournament review is not only telling players whether they won or lost, but helping them understand why and what they can do next."
            }
          ]
        },
        {
          label: "全球化设计",
          labelEn: "Localization Design",
          icon: "design-review",
          pages: [
            {
              label: "01｜项目概览：S3G 本地化 UI 设计",
              header: "01｜项目概览：S3G 本地化 UI 设计\n01｜Project Overview: S3G Localization UI Design",
              title: "从中文版本到海外版本，完成游戏 UI 的多语言适配\nAdapt game UI from Chinese version to localized overseas versions",
              subtitle: "因保密需求，部分信息已做模糊化处理。\nSome details have been obscured for confidentiality.",
              visual: "./assets/p2/sanguo/localization/lo_01.webp",
              body: "项目信息\nProject Info\n\n项目类型：SLG 游戏本地化设计 / 多语言 UI 适配 / 海外版本支持\nType: SLG Game Localization Design / Multilingual UI Adaptation / Overseas Version Support\n\n项目职责：本地化 UI 适配、文本长度检查、界面布局调整、图标与字体规范整理\nRole: Localization UI Adaptation / Text Length Review / Layout Adjustment / Icon & Font Guidelines\n\n项目范围：多语言文本、按钮适配、弹窗布局、图标规范、字体显示、海外版本界面检查\nScope: Multilingual Text / Button Adaptation / Pop-up Layout / Icon Guidelines / Font Display / Overseas UI Review\n\n项目状态：已完成本地化 UI 设计节选整理\nStatus: Localization UI design selected content completed\n\n正文\n\n这是一项围绕 SLG 游戏海外版本展开的本地化 UI 设计项目。\nThis is a localization UI design project for the overseas version of an SLG game.\n\n项目重点并不是简单替换语言文本，而是需要在不同语言长度、阅读习惯、字体显示和界面结构之间重新平衡信息表达。\nThe focus was not simply replacing text, but rebalancing information presentation across different text lengths, reading habits, font rendering, and UI structures.\n\n在项目中，我参与了多语言界面适配、文本扩展检查、按钮与弹窗调整，以及图标和字体相关规范整理，帮助海外版本在保持原有游戏风格的同时，具备更稳定的可读性和可落地性。\nIn this project, I worked on multilingual UI adaptation, text expansion checks, button and pop-up adjustments, and icon and font guideline organization, helping the overseas version maintain the original game style while improving readability and implementation stability.\n\n项目核心\nCore Focus\n\n将中文游戏 UI 从“原语言界面”转化为“适合多语言版本稳定展示的本地化界面”。\nTransform the original Chinese UI into a localized interface that can support multiple languages with stable display.\n\n本地化设计的难点在于，不同语言并不会以同样的长度、节奏和视觉密度呈现。英文、日文、越南语等语言在按钮、标题、弹窗和说明文字中都会带来不同程度的空间压力。\nThe challenge of localization design is that different languages do not share the same length, rhythm, or visual density. English, Japanese, Vietnamese, and other languages create different levels of spatial pressure in buttons, titles, pop-ups, and explanatory text.\n\n因此，本项目的设计重点不是单纯翻译，而是通过布局调整、文本容错、字体选择和规范沉淀，让界面在不同语言环境下都能保持清晰、稳定和一致。\nTherefore, the design focus was not simple translation, but using layout adjustment, text tolerance, font selection, and guideline documentation to keep the interface clear, stable, and consistent across languages.\n\n设计拆解\nDesign Breakdown\n\n01｜多语言文本适配\n01｜Multilingual Text Adaptation\n\n检查不同语言下的文字长度、换行方式和阅读节奏，避免按钮、标题和说明文字溢出。\nReview text length, line breaks, and reading rhythm across languages to prevent overflow in buttons, titles, and descriptions.\n\n02｜界面布局调整\n02｜UI Layout Adjustment\n\n根据文本扩展情况调整按钮宽度、弹窗结构和信息间距，让界面在多语言版本中仍然可读。\nAdjust button width, pop-up structure, and spacing based on text expansion to keep the interface readable in localized versions.\n\n03｜字体与图标规范\n03｜Font & Icon Guidelines\n\n整理不同语言环境下的字体显示、图标含义和视觉一致性，降低后续适配成本。\nOrganize font display, icon meaning, and visual consistency across language environments to reduce future adaptation cost.\n\n结论\nConclusion\n\n本项目最终形成了一套针对多语言版本的 UI 适配方法，让本地化设计不只是翻译文本，而是覆盖文本、布局、字体、图标和规范的完整设计支持。\nThe project established a UI adaptation approach for multilingual versions, turning localization from text translation into complete design support across text, layout, fonts, icons, and guidelines.\n\n核心表达\nKey Sentence\n\n好的本地化 UI 设计，不只是让玩家“看懂文字”，而是让不同语言环境下的玩家都能顺畅理解界面并完成操作。\nGood localization UI design is not only about making text understandable; it helps players in different language environments read the interface smoothly and complete actions confidently."
            },
            {
              label: "02｜设计挑战：多语言文本与界面适配",
              header: "02｜设计挑战：多语言文本与界面适配\n02｜Design Challenge: Multilingual Text and UI Adaptation",
              title: "在不同语言长度中，保持界面的清晰与稳定\nKeep the interface clear and stable across different text lengths",
              subtitle: "因保密需求，部分信息已做模糊化处理。\nSome details have been obscured for confidentiality.",
              visual: "./assets/p2/sanguo/localization/lo_02.webp",
              body: "项目信息\nProject Info\n\n项目类型：多语言适配 / 文本容错 / UI 可读性优化\nType: Multilingual Adaptation / Text Tolerance / UI Readability Optimization\n\n项目职责：文本长度检查、语言差异分析、界面问题定位、适配风险整理\nRole: Text Length Review / Language Difference Analysis / UI Issue Identification / Adaptation Risk Documentation\n\n项目范围：标题文本、按钮文字、说明文案、弹窗内容、界面间距、文本换行\nScope: Titles / Button Text / Descriptions / Pop-up Content / UI Spacing / Line Breaks\n\n项目状态：已完成多语言适配问题整理\nStatus: Multilingual adaptation issues documented\n\n正文\n\n多语言 UI 适配的主要挑战，是原本适用于中文的界面结构，在海外语言中可能出现文字过长、换行失控、按钮拥挤和信息层级变弱等问题。\nThe main challenge of multilingual UI adaptation is that an interface originally designed for Chinese may encounter text expansion, uncontrolled line breaks, crowded buttons, and weakened hierarchy in overseas languages.\n\n中文信息密度较高，通常可以用较短字符表达完整含义；但英文、越南语等语言在相同语义下往往需要更长空间，日文则需要考虑字体显示、行高和视觉平衡。\nChinese has high information density and can often express meaning with fewer characters, while English and Vietnamese usually require more space for the same meaning. Japanese also requires attention to font rendering, line height, and visual balance.\n\n因此，本页重点整理本地化过程中出现的典型问题，并将它们转化为后续界面适配的判断依据。\nThis page summarizes typical localization issues and turns them into design criteria for later UI adaptation.\n\n项目核心\nCore Focus\n\n多语言设计的关键，是提前为文本变化预留空间，而不是在问题出现后逐个修补。\nThe key to multilingual design is reserving space for text variation in advance, rather than fixing each issue after it appears.\n\n如果界面只按照中文文本长度设计，海外版本很容易出现视觉拥挤、信息截断或操作入口不清晰的问题。\nIf the interface is designed only around Chinese text length, overseas versions can easily suffer from visual crowding, text truncation, and unclear action entries.\n\n所以设计需要从一开始就考虑文本扩展、换行规则、组件弹性和信息优先级。\nTherefore, the design must consider text expansion, line-break rules, component flexibility, and information priority from the beginning.\n\n设计拆解\nDesign Breakdown\n\n01｜文本长度差异\n01｜Text Length Differences\n\n不同语言在相同含义下占用空间不同，需要评估按钮、标题和说明区域的最大承载范围。\nDifferent languages occupy different amounts of space for the same meaning, so buttons, titles, and description areas need maximum capacity checks.\n\n02｜换行与截断风险\n02｜Line Break and Truncation Risk\n\n长文本容易造成换行混乱或信息截断，因此需要定义可换行、可缩略和不可压缩的文本区域。\nLong text can cause messy line breaks or truncation, so areas that can wrap, abbreviate, or remain fixed need to be clearly defined.\n\n03｜视觉层级稳定性\n03｜Visual Hierarchy Stability\n\n语言变化不应破坏标题、重点信息和操作按钮之间的层级关系。\nLanguage changes should not break the hierarchy between titles, key information, and action buttons.\n\n结论\nConclusion\n\n通过对多语言文本问题进行分类，项目能够更准确地判断哪些界面需要扩大容器，哪些内容需要缩写，哪些模块需要重新组织布局。\nBy classifying multilingual text issues, the project could better determine which interfaces needed larger containers, which content required abbreviation, and which modules needed layout restructuring.\n\n核心表达\nKey Sentence\n\n本地化设计不是把文字塞进原界面，而是让界面有能力承接不同语言的表达方式。\nLocalization design is not about fitting translated text into the original interface; it is about making the interface capable of supporting different ways of expression."
            },
            {
              label: "03｜核心方案：从中文 UI 到海外版本的适配规则",
              header: "03｜核心方案：从中文 UI 到海外版本的适配规则\n03｜Core Solution: UI Adaptation Rules from Chinese to Overseas Versions",
              title: "通过布局容错，让多语言界面保持可读与可用\nMaintain readability and usability through flexible layout rules",
              subtitle: "因保密需求，部分信息已做模糊化处理。\nSome details have been obscured for confidentiality.",
              visual: "./assets/p2/sanguo/localization/lo_03.webp",
              body: "项目信息\nProject Info\n\n项目类型：界面适配规则 / 组件容错 / 多语言版本设计\nType: UI Adaptation Rules / Component Tolerance / Multilingual Version Design\n\n项目职责：布局调整、组件规则整理、界面对比检查、适配方案输出\nRole: Layout Adjustment / Component Rule Documentation / Interface Comparison Review / Adaptation Solution Delivery\n\n项目范围：按钮、弹窗、标题栏、说明文本、列表信息、图标与文案组合\nScope: Buttons / Pop-ups / Title Bars / Descriptions / List Information / Icon-text Combinations\n\n项目状态：已完成核心适配方案整理\nStatus: Core adaptation solutions completed\n\n正文\n\n在具体界面适配中，我将本地化问题从“单个文字太长”转化为“组件是否具备弹性”的设计问题。\nIn detailed UI adaptation, I reframed localization issues from “individual text being too long” into the design question of whether components had enough flexibility.\n\n例如，按钮需要支持不同语言下的宽度变化，弹窗需要预留标题和正文扩展空间，列表信息需要在不同字符长度下保持对齐和可读。\nFor example, buttons needed to support width changes across languages, pop-ups needed extra room for title and body expansion, and list information needed to remain aligned and readable under different character lengths.\n\n因此，本页重点展示从中文 UI 到海外版本时，如何通过组件规则和布局容错来降低本地化风险。\nThis page focuses on how component rules and layout tolerance reduced localization risks when adapting Chinese UI to overseas versions.\n\n项目核心\nCore Focus\n\n本地化适配的重点，是让 UI 组件具备语言弹性，而不是为每一种语言单独重做界面。\nThe focus of localization adaptation is to make UI components language-flexible, rather than redesigning the interface separately for every language.\n\n如果每次遇到文本溢出都单独调整，会导致版本维护成本变高，也容易破坏整体视觉一致性。\nIf each text overflow issue is fixed separately, version maintenance becomes costly and visual consistency can be damaged.\n\n所以设计方案需要沉淀为可复用规则，让后续语言版本能够在同一套结构下稳定扩展。\nTherefore, the solution needed to become reusable rules so later language versions could expand within the same structure.\n\n设计拆解\nDesign Breakdown\n\n01｜按钮容错\n01｜Button Tolerance\n\n根据不同语言长度调整按钮宽度、文字对齐和最小安全边距，避免操作入口被挤压。\nAdjust button width, text alignment, and minimum safe padding based on language length to avoid compressed action entries.\n\n02｜弹窗扩展\n02｜Pop-up Expansion\n\n为标题、正文和确认按钮预留扩展空间，让弹窗在多语言环境下保持稳定结构。\nReserve expansion space for titles, body text, and confirmation buttons to keep pop-ups stable across languages.\n\n03｜信息对齐\n03｜Information Alignment\n\n针对列表、标签和说明文本整理对齐规则，保证不同语言下信息仍然易读。\nDefine alignment rules for lists, labels, and descriptions to keep information readable across languages.\n\n04｜图文组合\n04｜Icon-text Combination\n\n检查图标与文字之间的关系，避免翻译后文字长度影响图标识别和操作理解。\nReview the relationship between icons and text to prevent translated text from weakening icon recognition and action clarity.\n\n结论\nConclusion\n\n通过对按钮、弹窗、列表和图文组合进行适配规则整理，项目让海外版本 UI 在不同语言下保持了更高的稳定性和一致性。\nBy defining adaptation rules for buttons, pop-ups, lists, and icon-text combinations, the project improved UI stability and consistency across languages.\n\n核心表达\nKey Sentence\n\n真正有效的本地化方案，不是逐页修补，而是建立一套可以被多语言复用的界面规则。\nAn effective localization solution is not about fixing pages one by one, but building reusable UI rules that can support multiple languages."
            },
            {
              label: "04｜设计沉淀：多地区案例与本地化规范",
              header: "04｜设计沉淀：多地区案例与本地化规范\n04｜Design Guidelines: Regional Cases and Localization Standards",
              title: "将适配经验沉淀为可复用的本地化设计规范\nTurn adaptation experience into reusable localization guidelines",
              subtitle: "因保密需求，部分信息已做模糊化处理。\nSome details have been obscured for confidentiality.",
              visual: "./assets/p2/sanguo/localization/lo_04.webp",
              body: "项目信息\nProject Info\n\n项目类型：本地化规范 / 多地区版本适配 / 设计沉淀\nType: Localization Guidelines / Regional Version Adaptation / Design Documentation\n\n项目职责：案例整理、规范归纳、适配规则沉淀、设计文档输出\nRole: Case Organization / Guideline Summarization / Adaptation Rule Documentation / Design Documentation\n\n项目范围：多语言案例、字体规范、图标规范、组件规则、界面检查标准\nScope: Multilingual Cases / Font Guidelines / Icon Guidelines / Component Rules / UI Review Standards\n\n项目状态：已完成本地化设计规范整理\nStatus: Localization design guidelines completed\n\n正文\n\n在完成具体界面适配后，我进一步将项目中的多语言问题、界面调整方式和适配经验整理为规范。\nAfter completing specific UI adaptations, I further organized multilingual issues, layout adjustment methods, and adaptation experience into guidelines.\n\n这些规范不仅用于当前版本，也可以帮助后续版本在新增语言、更新活动界面或调整功能模块时，减少重复沟通和返工。\nThese guidelines supported not only the current version, but also future language additions, event page updates, and feature adjustments by reducing repeated communication and rework.\n\n因此，本页重点展示项目从“单次本地化支持”到“长期规范沉淀”的设计价值。\nThis page highlights the design value of moving from one-time localization support to long-term guideline documentation.\n\n项目核心\nCore Focus\n\n本地化设计的最终价值，是让团队在后续版本中能够更稳定、更低成本地完成多语言适配。\nThe final value of localization design is helping the team complete multilingual adaptation more consistently and with lower cost in future versions.\n\n如果没有规范沉淀，本地化问题会在不同活动、不同功能和不同语言中反复出现。\nWithout guideline documentation, localization issues will repeatedly appear across different events, features, and languages.\n\n所以需要将案例经验转化为字体、图标、组件和检查标准，让设计和研发都能复用。\nTherefore, case experience needed to be turned into font, icon, component, and review standards that both design and development teams could reuse.\n\n设计拆解\nDesign Breakdown\n\n01｜多地区案例整理\n01｜Regional Case Organization\n\n整理不同语言版本中的典型适配案例，识别高频问题和可复用解决方式。\nOrganize typical adaptation cases across languages to identify frequent issues and reusable solutions.\n\n02｜字体显示规范\n02｜Font Display Guidelines\n\n检查不同语言下的字体显示效果，保证文字清晰、风格统一，并避免显示异常。\nReview font display across languages to ensure clarity, consistent style, and avoid rendering issues.\n\n03｜图标与语义规范\n03｜Icon and Meaning Guidelines\n\n确保图标含义在不同地区语境下仍然清晰，减少文化理解偏差。\nEnsure icon meanings remain clear across regional contexts and reduce cultural interpretation gaps.\n\n04｜检查标准沉淀\n04｜Review Standards\n\n形成多语言界面检查标准，包括溢出、换行、间距、对齐和信息层级。\nBuild multilingual UI review standards covering overflow, line breaks, spacing, alignment, and information hierarchy.\n\n结论\nConclusion\n\n本项目最终将多语言适配经验沉淀为本地化设计规范，让后续海外版本能够在统一标准下持续扩展。\nThe project turned multilingual adaptation experience into localization design guidelines, enabling future overseas versions to expand under a unified standard.\n\n核心表达\nKey Sentence\n\n好的本地化设计，不只是完成一次海外版本适配，而是让团队拥有持续支持多语言产品的能力。\nGood localization design is not only about adapting one overseas version; it gives the team the ability to continuously support multilingual products."
            }
          ]
        },
        {
          label: "用户研究",
          labelEn: "User Research",
          icon: "user-research",
          pageLimit: 2,
          pages: [
            {
              label: "01｜项目概览：战报系统阅读体验的用户调研",
              header: "01｜项目概览：战报系统阅读体验的用户调研\n01｜Project Overview: User Research on Battle Report Reading",
              title: "从玩家阅读行为中，发现战报系统的体验断点\nIdentify experience gaps through player reading behavior",
              subtitle: "",
              visual: "./assets/p2/sanguo/research/research_01.webp",
              body: "项目信息\nProject Info\n\n项目类型：用户研究 / 战报系统分析 / SLG 体验优化\nType: User Research / Battle Report Analysis / SLG UX Optimization\n\n项目职责：调研分析、用户行为观察、问题整理、优化方向提炼\nRole: Research Analysis / User Observation / Issue Mapping / Optimization Direction\n\n项目范围：战报筛选、战报详情、战损战获、图表化展示、同盟战报、研究方法\nScope: Report Filtering / Report Details / Losses & Gains / Data Visualization / Alliance Reports / Research Methods\n\n项目状态：已完成调研分析与优化探索\nStatus: Research analysis and optimization exploration completed\n\n这是一项围绕 SLG 战报系统展开的用户体验调研项目。\nThis is a user research project focused on the SLG battle report system.\n\n调研重点不是单纯判断玩家是否能打开战报，而是观察玩家在阅读战报时真正想获得什么信息：他们是否能快速判断胜负，是否能理解战损与战获，是否能识别高价值战报，以及是否能通过战报复盘战斗原因。\nThe focus was not whether players could open a report, but what they truly needed from it: outcome, losses, gains, valuable reports, and battle reasons.\n\n在调研过程中，我从玩家阅读战报的完整路径出发，分析他们在个人战报、同盟战报、战报筛选、图表详情和战斗数据理解中的真实需求。通过可用性测试、访谈记录和问卷数据，定位当前战报系统中信息呈现、阅读效率和策略复盘方面的问题。\nI analyzed the full report-reading journey across personal reports, alliance reports, filtering, charts, and battle data, using usability tests, interviews, and questionnaires.\n\n项目核心\nCore Focus\n\n用用户调研验证：战报不只是结果通知，而是玩家判断战况与调整策略的重要工具。\nUse research to verify that battle reports are not just result notices, but tools for judgment and strategy adjustment.\n\nSLG 战报具有较高的信息密度。玩家打开战报时，不仅想知道「赢了还是输了」，也需要进一步理解：战斗发生在哪里，双方差距是什么，战损是否严重，哪些数据值得关注，以及后续是否需要调整阵容或策略。\nSLG reports are information-heavy. Players need to know not only win or loss, but also location, gaps, losses, key data, and next strategy.\n\n因此，本次调研关注的是一条完整的战报阅读路径：玩家能不能快速找到重要战报、能不能理解战斗结果、能不能看懂战损战获、能不能通过数据判断胜负原因，并进一步形成策略决策。\nSo this research focused on the full reading path: finding key reports, understanding results, reading losses and gains, analyzing reasons, and making decisions.\n\n研究拆解\nResearch Breakdown\n\n01｜观察战报信息是否容易理解\n01｜Check Report Readability\n\n调研中首先关注玩家是否能快速读懂战报中的基础信息，例如胜负、战斗类型、战损战获、坐标、时间和双方信息。\nThe first focus was whether players could quickly read basic information: outcome, type, losses, gains, coordinates, time, and both sides.\n\n如果玩家需要反复查看或依赖猜测，说明战报信息层级和展示方式仍存在理解成本。\nIf players need to check repeatedly or guess, the hierarchy still creates reading cost.\n\n02｜观察战报筛选是否满足需求\n02｜Check Filtering Needs\n\n玩家在大量战报中并不希望逐条浏览，而是希望快速找到与自己相关、与同盟相关或具有复盘价值的战报。\nPlayers do not want to browse every report; they want to quickly find personal, alliance-related, or review-worthy reports.\n\n因此，战报筛选是否准确、分类是否清晰，会直接影响玩家的阅读效率和后续判断。\nAccurate filtering and clear categories directly affect reading efficiency and decision-making.\n\n03｜观察战损战获是否形成有效判断\n03｜Check Losses & Gains\n\n战损战获是玩家最关注的信息之一。\nLosses and gains are among the most important information for players.\n\n调研中需要判断玩家是否能快速知道自己损失了什么、获得了什么，以及这些结果是否值得继续投入资源或调整策略。\nThe research checked whether players could quickly understand what they lost, what they gained, and whether strategy adjustment was needed.\n\n04｜观察图表化信息是否有辅助作用\n04｜Check Visualization Support\n\n复杂战斗数据如果全部以文字或数字展示，容易造成阅读负担。\nComplex battle data can be hard to read when shown only as text or numbers.\n\n因此，本次调研也关注图表化详情是否能帮助玩家更直观地理解兵力变化、战损趋势和双方差距。\nSo the research also explored whether charts could help players understand troop changes, loss trends, and side differences.\n\n结论\nConclusion\n\n本次调研帮助团队明确了战报系统的关键问题：战报筛选未完全满足玩家预期，战报信息阅读成本较高，高价值战报不易识别，复杂数据需要更直观的图表化辅助。\nThis research clarified key issues: filtering did not fully meet expectations, reports were hard to read, valuable reports were hard to identify, and complex data needed clearer visualization.\n\n核心表达\nKey Sentence\n\n一个好的战报系统，不只是告诉玩家「战斗结束了」，而是帮助玩家快速理解「发生了什么、为什么会这样、下一步该怎么做」。\nA good battle report system does not just say \"the battle is over\"; it helps players understand what happened, why it happened, and what to do next."
            },
            {
              label: "02｜调研发现：玩家阅读战报时最关注什么",
              header: "02｜调研发现：玩家阅读战报时最关注什么\n02｜Research Findings: What Players Care About in Battle Reports",
              title: "玩家打开战报时，首先想判断战况，其次才是查看细节\nPlayers first judge the situation, then read the details",
              subtitle: "",
              visual: "./assets/p2/dashen/diaoyan/ceshi_02.webp",
              body: "项目信息\nProject Info\n\n项目类型：调研结果分析 / 玩家需求拆解 / 信息优先级判断\nType: Research Findings / Player Needs Breakdown / Information Priority\n\n项目职责：痛点归纳、用户期待信息整理、核心问题提炼\nRole: Pain Point Summary / User Needs Mapping / Key Issue Definition\n\n项目范围：战报阅读、战况判断、胜负原因、图表辅助、同盟战报\nScope: Report Reading / Battle Judgment / Win-loss Reasons / Visualization Support / Alliance Reports\n\n项目状态：已完成关键发现整理\nStatus: Key findings completed\n\n通过调研可以发现，玩家阅读战报并不是为了「看一封邮件」，而是为了快速完成战况判断。\nThe research showed that players do not read reports as \"mail\"; they read them to quickly judge the battle situation.\n\n他们首先想知道这场战斗的基础结果：谁赢了、谁输了、损失多少、获得多少、发生在哪里、是否与自己或同盟有关。随后，进阶玩家才会进一步关注更复杂的信息，例如双方战力差距、兵力变化、增益影响、回合细节和失败原因。\nThey first want to know the basic result: who won, who lost, losses, gains, location, and relevance. Advanced players then look at power gaps, troop changes, buffs, rounds, and reasons.\n\n这说明战报系统需要同时服务两类需求：一类是快速判断，一类是深度复盘。如果所有信息都堆叠在同一层级，普通玩家会觉得难读，深度玩家也难以快速找到关键数据。\nThis means the report system needs to support both quick judgment and deep review. If all information is on the same level, both user groups struggle.\n\n项目核心\nCore Focus\n\n玩家真正需要的不是更多信息，而是更清晰的信息优先级。\nPlayers do not need more information; they need clearer priorities.\n\n战报信息本身并不缺少内容，但问题在于：重要信息是否足够前置，不同类型的信息是否有清晰分层，玩家能否快速找到当前最关心的内容。\nThe issue is not lack of content, but whether key information is prioritized, layered, and easy to find.\n\n因此，调研发现的重点不是「增加多少功能」，而是重新判断哪些信息应该第一眼看到，哪些信息应该被折叠，哪些数据应该通过图表、筛选或对比方式降低阅读成本。\nSo the focus was not adding features, but deciding what should be shown first, what should be folded, and what needs charts, filters, or comparison.\n\n研究拆解\nResearch Breakdown\n\n01｜战报筛选未达预期\n01｜Filtering Did Not Meet Expectations\n\n玩家面对大量战报时，需要更有效的筛选方式。\nPlayers need better filtering when facing many battle reports.\n\n如果筛选维度不够贴合玩家目标，就会导致玩家仍然需要手动寻找关键战报，降低战报系统的使用效率。\nIf filters do not match player goals, players still need to search manually, reducing efficiency.\n\n02｜战报信息难以阅读\n02｜Reports Were Hard to Read\n\n战报中包含玩家信息、战斗类型、战损战获、坐标、时间、援军、回放等多类内容。\nReports include player info, battle type, losses, gains, coordinates, time, reinforcements, and replay.\n\n如果这些信息缺少清晰层级，玩家就需要在复杂页面中自行判断重点。\nWithout clear hierarchy, players must find the key points by themselves.\n\n03｜高价值战报难以辨别\n03｜High-value Reports Were Hard to Identify\n\n并不是每一封战报都值得详细查看。\nNot every report deserves detailed reading.\n\n玩家更关注与自身损失、同盟攻防、关键战斗和策略调整有关的战报，因此系统需要帮助玩家识别哪些战报更值得打开。\nPlayers care more about personal losses, alliance battles, key fights, and strategy changes, so the system should help them identify valuable reports.\n\n04｜图表化有辅助作用\n04｜Visualization Was Helpful\n\n调研中可以看到，图表化详情能够帮助玩家更直观地理解战斗变化。\nCharts helped players understand battle changes more intuitively.\n\n相比纯文字和数字，趋势、对比和变化过程更适合通过图形方式呈现。\nTrends, comparisons, and changes are easier to read through visuals than text or numbers.\n\n05｜同盟战报具有攻略属性\n05｜Alliance Reports Had Strategy Value\n\n同盟战报不仅是信息记录，也会影响集体判断。\nAlliance reports are not only records; they also support group decisions.\n\n玩家希望通过同盟战报了解对方阵容、攻击方式和同盟攻防情况，为后续策略提供参考。\nPlayers use them to understand enemy lineups, attack patterns, and alliance defense or offense.\n\n结论\nConclusion\n\n战报系统的核心问题，不是信息不足，而是信息排序、筛选方式和阅读方式仍然不够贴合玩家的判断路径。\nThe core issue is not insufficient information, but information order, filtering, and reading flow.\n\n核心表达\nKey Sentence\n\n玩家打开战报的第一需求，是快速知道「这场战斗值不值得看」；第二需求，才是理解「这场战斗为什么会赢或输」。\nPlayers first need to know whether a report is worth reading; then they need to understand why the battle was won or lost."
            },
            {
              label: "03｜优化探索：从结果通知到策略复盘工具",
              header: "03｜优化探索：从结果通知到策略复盘工具\n03｜Design Exploration: From Result Notice to Strategy Review Tool",
              title: "用筛选、图表化和对比展示，降低战报阅读成本\nReduce reading cost through filtering, visualization, and comparison",
              subtitle: "",
              visual: "./assets/p2/sanguo/research/research_03.webp",
              body: "项目信息\nProject Info\n\n项目类型：优化方向探索 / 战报信息重构 / 数据展示设计\nType: Optimization Exploration / Report Information Restructure / Data Display Design\n\n项目职责：需求转译、方案方向整理、信息层级拆解\nRole: Need Translation / Direction Mapping / Information Hierarchy\n\n项目范围：战报筛选、图表详情、总兵损展示、双方对比、同盟战报\nScope: Report Filtering / Chart Details / Total Loss Display / Side Comparison / Alliance Reports\n\n项目状态：已完成优化方向提炼\nStatus: Optimization directions completed\n\n在明确玩家需求后，我将战报系统的优化方向从「展示战斗结果」转向「辅助策略复盘」。\nAfter clarifying player needs, I shifted the direction from \"showing battle results\" to \"supporting strategy review.\"\n\n战报不应该只是告诉玩家胜负，而应该帮助玩家快速完成三个判断：这场战斗是否重要、双方差距在哪里、下一步是否需要调整策略。围绕这一目标，优化探索主要集中在筛选效率、图表化展示、战损战获呈现和双方信息对比等方向。\nA report should help players judge whether the battle matters, where the gap is, and whether strategy should change. The exploration focused on filtering, charts, losses/gains, and comparison.\n\n项目核心\nCore Focus\n\n把战报从被动阅读的信息结果，转化为主动判断的策略工具。\nTurn battle reports from passive result records into active strategy tools.\n\n当玩家打开战报时，系统需要先提供第一眼结论，再提供可展开的细节数据。普通玩家可以快速理解战斗结果，深度玩家则可以继续查看图表、兵损、增益和回合详情。\nThe system should show the conclusion first, then provide expandable details. Casual players get quick results; advanced players can go deeper.\n\n因此，设计方向不是让页面看起来更复杂，而是通过信息分层和可视化表达，让复杂战斗数据变得更容易判断。\nThe goal was not to make the page more complex, but to make complex data easier to judge through hierarchy and visualization.\n\n设计拆解\nDesign Breakdown\n\n01｜战报筛选优化\n01｜Report Filtering Optimization\n\n针对大量战报难以查找的问题，优化方向是提供更贴近玩家目标的筛选维度。\nTo solve report overload, the direction was to provide filters that better match player goals.\n\n例如按个人、同盟、战斗类型、重要程度或相关对象进行筛选，帮助玩家更快定位需要查看的战报。\nFor example: personal, alliance, battle type, importance, or related target.\n\n02｜个人战报图表化\n02｜Personal Report Visualization\n\n对于个人战报中的兵力变化、战损趋势和双方差距，可以通过图表进行辅助表达。\nTroop changes, loss trends, and side gaps in personal reports can be supported with charts.\n\n图表不是为了装饰页面，而是帮助玩家在复杂数据中更快看出变化趋势。\nCharts are not decoration; they help players read trends faster.\n\n03｜总兵损展示\n03｜Total Loss Display\n\n战损战获需要更直接地呈现。\nLosses and gains need to be shown more directly.\n\n通过突出总兵损、资源损失、治疗数量和剩余兵力等关键数据，玩家可以快速判断这场战斗的成本是否可接受。\nBy highlighting total loss, resource loss, healing, and remaining troops, players can judge battle cost faster.\n\n04｜双方信息横向对比\n04｜Side-by-side Comparison\n\n战报中的双方玩家、阵容、兵力、战力和增益情况适合采用横向对比方式。\nPlayers, lineups, troops, power, and buffs are suitable for side-by-side comparison.\n\n这种方式能帮助玩家更快理解双方差距，而不是在分散数据中反复寻找原因。\nThis helps players understand gaps faster without searching through scattered data.\n\n05｜同盟战报策略价值\n05｜Strategic Value of Alliance Reports\n\n同盟战报更偏向集体决策和攻略参考。\nAlliance reports are more about group decision-making and strategy reference.\n\n玩家希望从同盟战报中看到敌方阵容、战术倾向和集体攻防结果，因此同盟战报需要更强调筛选、共享和复盘价值。\nPlayers want to see enemy lineups, tactical patterns, and alliance battle results, so filtering, sharing, and review value should be emphasized.\n\n结论\nConclusion\n\n战报优化的核心方向，是让玩家先快速理解结果，再按需进入深度数据；既照顾普通玩家的阅读效率，也满足进阶玩家的复盘需求。\nThe key direction is to show the result first, then allow deeper data review when needed.\n\n核心表达\nKey Sentence\n\n战报不是一张结果单，而是一套帮助玩家判断损失、理解差距、调整策略的数据系统。\nA battle report is not a result sheet, but a data system for judging losses, understanding gaps, and adjusting strategy."
            },
            {
              label: "04｜研究方法：可用性测试、访谈与数据记录",
              header: "04｜研究方法：可用性测试、访谈与数据记录\n04｜Research Method: Usability Testing, Interviews & Data Records",
              title: "通过真实用户反馈，验证战报阅读中的问题与优化方向\nValidate report-reading issues through real user feedback",
              subtitle: "",
              visual: "./assets/p2/sanguo/research/research_04.webp",
              body: "项目信息\nProject Info\n\n项目类型：研究方法整理 / 可用性测试 / 用户访谈 / 数据记录\nType: Research Method / Usability Testing / User Interviews / Data Records\n\n项目职责：测试观察、访谈记录、问卷整理、结论归纳\nRole: Test Observation / Interview Notes / Questionnaire Sorting / Insight Summary\n\n项目范围：可用性测试、半开放式访谈、问卷数据、参与者记录、关键词定义\nScope: Usability Testing / Semi-structured Interviews / Questionnaire Data / Participant Records / Keyword Definition\n\n项目状态：已完成研究资料整理\nStatus: Research materials completed\n\n为了避免仅凭主观判断优化战报系统，本次调研结合了可用性测试、半开放式访谈和问卷数据记录。\nTo avoid relying only on design assumptions, this research combined usability testing, semi-structured interviews, and questionnaire records.\n\n测试中，用户需要基于不同战报页面完成阅读、判断和反馈任务。通过观察他们的阅读路径、停顿位置、疑惑点和表达内容，可以判断哪些信息真正影响理解效率，哪些展示方式能够帮助他们更快完成战况判断。\nUsers read, judged, and gave feedback on different report pages. Their paths, pauses, confusion points, and comments revealed what affected understanding.\n\n项目核心\nCore Focus\n\n用真实用户的阅读过程，验证战报系统中哪些问题是真实存在的。\nUse real reading behavior to validate which report issues truly exist.\n\n战报系统的信息量很大，如果只从设计者视角判断，很容易误以为「信息都有展示」就等于「用户能够理解」。\nBecause reports are information-heavy, designers may assume that showing information means users can understand it.\n\n但用户测试可以帮助我们看到：玩家实际会先看哪里，会忽略哪里，会在哪些信息之间反复对照，又会在哪些节点产生困惑。\nUser testing shows where players look first, what they ignore, what they compare, and where they get confused.\n\n研究拆解\nResearch Breakdown\n\n01｜可用性测试\n01｜Usability Testing\n\n通过多个战报方案或页面样式进行测试，观察用户在不同页面中的阅读效率和理解情况。\nTested multiple report layouts to observe reading efficiency and understanding.\n\n测试重点包括：是否能快速识别胜负、是否能找到关键数据、是否能理解图表含义，以及是否能判断战斗原因。\nThe focus was outcome recognition, key data search, chart understanding, and battle reason judgment.\n\n02｜半开放式访谈\n02｜Semi-structured Interviews\n\n访谈用于补充用户对战报系统的真实想法。\nInterviews helped capture users' real thoughts about the report system.\n\n相比单纯选择题，半开放式访谈可以让用户解释自己为什么关注某类信息、为什么觉得某些战报难读，以及他们希望战报提供什么帮助。\nCompared with simple choices, interviews let users explain what they cared about, why some reports were hard to read, and what support they expected.\n\n03｜问卷与数据记录\n03｜Questionnaires & Data Records\n\n通过问卷和表格记录用户反馈，将定性表达转化为可归纳的问题类型。\nQuestionnaires and tables turned qualitative feedback into summarized issue types.\n\n这些数据帮助团队判断哪些问题属于个别反馈，哪些问题具有较高共性。\nThe data helped distinguish individual feedback from common issues.\n\n04｜参与者信息整理\n04｜Participant Information\n\n记录参与者的游戏经验、战报使用习惯和理解差异，有助于区分普通玩家和深度玩家的不同需求。\nRecording game experience, report habits, and understanding differences helped separate casual and advanced player needs.\n\n这也能避免用单一用户类型代表所有玩家。\nIt also avoided using one user type to represent all players.\n\n05｜关键词定义\n05｜Keyword Definition\n\n在研究中对 SLG、战报、个人战报、同盟战报、战损、战获等关键词进行定义，保证团队对讨论对象有一致理解。\nKey terms such as SLG, battle report, personal report, alliance report, losses, and gains were defined for shared understanding.\n\n这对于后续方案沟通和设计落地非常重要。\nThis was important for later design communication and delivery.\n\n结论\nConclusion\n\n研究方法的价值，是让战报优化不再只是设计直觉，而是建立在真实用户反馈、行为观察和数据记录之上。\nThe value of the research method was grounding optimization in real feedback, behavior observation, and data records.\n\n核心表达\nKey Sentence\n\n一次有效的战报调研，不只是问玩家喜不喜欢，而是看他们如何阅读、如何判断、在哪里困惑，以及哪些信息真正帮助他们做出下一步决策。\nEffective battle report research is not just asking whether players like it, but observing how they read, judge, get confused, and make decisions."
            }
          ]
        },
        {
          label: "产品规范",
          labelEn: "Product Guidelines",
          icon: "product-guidelines",
          pages: [
            {
              label: "01｜产品规范",
              title: "三国志·战略版 / ROMANCE OF THE THREE KINGDOMS Mobile",
              subtitle: "Product Guidelines",
              visual: "./assets/p2/sanguo/grid/grid_01.webp",
              body: "项目信息\nProject Info\n\n项目类型：SLG 赛事系统 / 复杂玩法设计 / 战斗体验优化\nType: SLG Tournament System / Complex Gameplay Design / Battle Experience Optimization\n\n因保密需求，部分信息已做模糊化处理。\nSome details have been obscured for confidentiality."
            },
            {
              label: "02｜产品规范",
              title: "三国志·战略版 / ROMANCE OF THE THREE KINGDOMS Mobile",
              subtitle: "Product Guidelines",
              visual: "./assets/p2/sanguo/grid/gird_02.webp",
              body: "项目信息\nProject Info\n\n项目类型：SLG 赛事系统 / 复杂玩法设计 / 战斗体验优化\nType: SLG Tournament System / Complex Gameplay Design / Battle Experience Optimization\n\n因保密需求，部分信息已做模糊化处理。\nSome details have been obscured for confidentiality."
            }
          ]
        }
      ]
    },
    {
      year: "2020",
      title: "网易大神 / Netease Godlike",
      subtitle: "Netease Godlike",
      intro: "围绕社区产品气质，整理品牌化内容与页面模块。",
      caseStudy: "将社区产品的功能信息转译为作品集可读的视觉模块，控制信息密度和品牌一致性。",
      role: "Product Visual / UI Presentation",
      tools: "Figma / Photoshop",
      outcome: "完成可横向浏览的项目入口和详情页占位内容。",
      visual: "./assets/p2/dashen/dashen_01.webp",
      visualNav: true,
      collapsibleSections: true,
      sections: [
        {
          label: "产品设计",
          labelEn: "Product Design",
          icon: "product-design",
          pages: [
            {
              label: "01｜作品集概览：应用设计与团队贡献",
              header: "01｜作品集概览：应用设计与团队贡献\n01｜Portfolio Overview: App Design & Team Contribution",
              title: "在项目设计之外，推动团队流程、工具与设计规范沉淀\nBeyond project delivery, I supported team workflows, tools, and design standards",
              subtitle: "",
              visual: "./assets/p2/dashen/dashen_01.webp",
              body: "本组作品集节选自游戏社区、内容生产工具、分发链路与运营活动相关项目，展示我在交互设计、复杂流程梳理、设计规范沉淀和跨团队协作中的实践。\nThis portfolio section includes game community, content creation tools, distribution flows, and campaign design projects.\n\n除了具体项目交付，我也参与了团队层面的设计走查、工具推进、规范制定、竞品分析、用户研究与新人培训，帮助团队更系统地发现问题、提升交付效率，并让设计方案更容易被上下游理解和落地。\nBeyond project delivery, I also supported design reviews, tool adoption, documentation standards, competitor research, user research, and onboarding.\n\n设计拆解\nDesign Breakdown\n\n01｜大神走查\n01｜Product Design Review\n\n组织并参与大神产品设计走查，排查交互与 UI 双端问题，输出问题报告与对应表单，推动后续优化排期。\nReviewed interaction and UI issues across platforms, then documented problems for follow-up optimization.\n\n02｜团队工具\n02｜Team Tools\n\n推动 Figma 在项目中的使用，并协同开发与项目管理团队探索交付流程优化，减少设计与研发之间的沟通成本。\nPromoted Figma use and improved collaboration between design, development, and project teams.\n\n03｜规范制定\n03｜Design Standards\n\n参与交互文档规范制定与落实，推动上下游沟通标准化，降低交接难度，提高设计交付效率。\nHelped standardize interaction documents to improve handoff and delivery efficiency.\n\n04｜分析报告\n04｜Research Reports\n\n定期输出竞品与行业分析报告，对齐优秀竞品体验，并为项目交互创新提供参考。\nCreated competitor and industry reports to support product and interaction decisions.\n\n05｜用研工作\n05｜User Research\n\n参与用户研究输出，覆盖可用性测试、课题研究、用户访谈等方向，为设计判断提供依据。\nSupported usability testing, research topics, and user interviews.\n\n06｜新人培训\n06｜Onboarding\n\n参与交互新人面试与培训，帮助新人熟悉业务流程与团队协作方式。\nSupported junior designer interviews and onboarding.\n\n结论\n\n这一页的核心作用，是在进入具体项目之前，先说明我不只是完成单点页面设计，也参与团队协作、流程优化与设计体系沉淀。\nThis page shows that my work covered not only screen design, but also team collaboration, process improvement, and design system support."
            },
            {
              label: "02｜内容生产工具：问题排查与设计策略",
              header: "02｜内容生产工具：问题排查与设计策略\n02｜Content Creation Tool: Issue Review & Design Strategy",
              title: "重构游戏社区内容生产工具，降低发布门槛并提升编辑效率\nRedesign content creation tools to lower posting barriers and improve editing efficiency",
              subtitle: "",
              visual: "./assets/p2/dashen/dashen_02.webp",
              body: "该项目围绕游戏社区内的内容生产工具展开，包括相册选择、模板使用、剪辑编辑等模块。\nThis project focused on content creation tools in a game community, including album selection, templates, and video editing.\n\n原有工具存在架构混乱、一致性差、操作效率低、细节反馈不足等问题。因此，我参与了从设计走查、问题拆解到交互方案重构的完整过程。\nThe original tool had unclear structure, inconsistent patterns, low efficiency, and weak feedback.\n\n项目目标不只是优化单个页面，而是通过流程简化、层级重构和工具规则沉淀，让用户能够更顺畅地完成内容发布，并为后续功能迭代打下基础。\nThe goal was not single-page optimization, but a clearer tool structure for smoother posting and future iteration.\n\n设计拆解\nDesign Breakdown\n\n01｜现有问题排查\n01｜Issue Review\n\n通过设计走查梳理原有生产工具中的交互与 UI 问题，包括层级混乱、按钮状态不一致、流程割裂、操作反馈不足等。\nReviewed interaction and UI issues such as unclear hierarchy, inconsistent buttons, broken flows, and weak feedback.\n\n02｜用户路径梳理\n02｜User Flow Mapping\n\n将用户发布路径简化为浏览、编辑、发布、再浏览的闭环，降低腰部用户的发布门槛，同时保留轻量专业编辑能力。\nSimplified the posting journey into browse, edit, publish, and review.\n\n03｜设计指针提炼\n03｜Design Principles\n\n围绕架构、体验、效率和微交互四个方向制定设计指针，明确后续方案的优化重点。\nDefined design principles around structure, experience, efficiency, and micro-interactions.\n\n04｜业务目标对齐\n04｜Business Alignment\n\n结合产品规划，将短期问题修复与长期工具体系重构结合，保证方案既能快速落地，也能支持后续拓展。\nBalanced short-term fixes with long-term tool system restructuring.\n\n结论\n\n该项目的核心价值，是将原本分散、混乱的生产工具问题，整理为一套清晰的设计策略和可持续迭代的工具优化方向。\nThe value was turning scattered tool issues into a clear strategy and scalable optimization direction."
            },
            {
              label: "03｜具体方案：流程简化与逐帧轴重构",
              header: "03｜具体方案：流程简化与逐帧轴重构\n03｜Solution: Flow Simplification & Timeline-based Editing",
              title: "以逐帧轴为核心，重建清晰、可扩展的编辑工具结构\nUse the timeline as the core to rebuild a clear and scalable editing structure",
              subtitle: "",
              visual: "./assets/p2/dashen/dashen_03.webp",
              body: "在具体方案中，我将生产工具流程简化为「选择照片、一键模板、视频调节、完成发布」，并围绕逐帧轴重新梳理主轴、副轴与二级编辑入口。\nI simplified the tool flow into photo selection, one-click templates, video adjustment, and publishing.\n\n这种结构让用户能够更清楚地理解当前编辑对象，也让不同工具之间的关系更加稳定，为后续功能扩展和一致性维护提供基础。\nThis structure helps users understand the current editing object and supports future expansion.\n\n设计拆解\nDesign Breakdown\n\n01｜流程简化\n01｜Flow Simplification\n\n将原本分散的编辑链路收敛为清晰流程，减少用户在相册选择、模板选择和快速编辑之间的反复跳转。\nReduced repeated jumps between album selection, template selection, and quick editing.\n\n02｜相册与模板选择优化\n02｜Album & Template Optimization\n\n在相册选择中增加可复选热区、不可选状态和再次选择入口；在模板选择中提升纵向浏览效率，并为后续引流入口预留空间。\nImproved selection areas, disabled states, reselect entry, and vertical browsing efficiency.\n\n03｜主轴结构重构\n03｜Main Timeline Structure\n\n以逐帧轴作为核心编辑结构，让模板、调整、美颜、滤镜等主要编辑行为围绕主轴展开，强化用户对编辑流程的理解。\nUsed the timeline as the core structure for templates, adjustments, beauty effects, and filters.\n\n04｜副轴精细编辑\n04｜Secondary Timeline Editing\n\n针对文字、贴纸等对时间精度要求更高的模块，引入副轴结构，让用户能够更精准地调整出现时间和持续时长。\nAdded a secondary timeline for precise text and sticker timing.\n\n05｜一级与二级区分\n05｜Level 1 & Level 2 Editing\n\n一级编辑用于快速插入动效与过渡；二级编辑让用户专注当前行为，避免其他轴操作干扰，降低认知负担。\nLevel 1 supports quick effects; Level 2 focuses on detailed editing without distraction.\n\n结论\n\n通过流程简化和轴中心制重构，该项目让内容生产工具从零散功能集合，转变为更清晰、更可理解、更方便迭代的编辑体系。\nThe tool changed from scattered functions into a clearer, more scalable editing system."
            },
            {
              label: "04｜体验细节：微交互、状态提示与结果反馈",
              header: "04｜体验细节：微交互、状态提示与结果反馈\n04｜Experience Details: Micro-interactions, States & Feedback",
              title: "通过微交互反馈和状态优化，让编辑体验更清晰、更有掌控感\nUse micro-feedback and state design to make editing clearer and more controllable",
              subtitle: "",
              visual: "./assets/p2/dashen/dashen_04.webp",
              body: "在基础架构调整之外，我也关注编辑过程中的细节反馈，例如贴纸对齐、速度调节、不可选状态、再次选择入口等。\nBeyond structure, I also focused on details such as sticker alignment, speed adjustment, disabled states, and reselect entry.\n\n这些细节帮助用户及时理解操作结果，减少误操作和认知负担，让工具从“能用”进一步变得“顺手”。\nThese details help users understand results faster, reduce mistakes, and make the tool feel smoother.\n\n设计拆解\nDesign Breakdown\n\n01｜贴纸对齐反馈\n01｜Sticker Alignment Feedback\n\n贴纸移动到中轴线时提供对齐提示与轻反馈，帮助用户更精准地完成排版。\nAlignment cues help users place stickers more precisely.\n\n02｜速度调节反馈\n02｜Speed Adjustment Feedback\n\n速度调节时加入触觉反馈，增强用户对数值变化的感知，让调整过程更直观。\nHaptic feedback makes speed changes easier to perceive.\n\n03｜状态提示优化\n03｜State Feedback\n\n补充不可选状态、再次选择入口和编辑中状态，降低用户在素材选择和编辑过程中的困惑。\nAdded disabled, reselect, and editing states to reduce confusion.\n\n04｜一致性细节打磨\n04｜Consistency Refinement\n\n统一按钮、抽屉结构、编辑状态和操作反馈，让不同编辑工具之间保持一致体验。\nUnified buttons, drawers, editing states, and feedback across tools.\n\n05｜结果反馈\n05｜Result Feedback\n\n新版视频工具上线后，用户反馈编辑更便捷；视频工具使用渗透率同比提升约三成，模板工具推荐率同比普通图文提升约八成，具体数据已做保密处理。\nAfter launch, users reported smoother editing; video tool usage and template performance both improved, with detailed data adjusted for confidentiality.\n\n结论\n\n该项目的细节价值，是通过微交互和状态反馈，让复杂编辑工具在使用过程中更清楚、更稳定，也更容易被用户掌控。\nThe value was making complex editing tools clearer, more stable, and easier to control."
            },
            {
              label: "05｜分发链路：游戏下载路径与转化策略",
              header: "05｜分发链路：游戏下载路径与转化策略\n05｜Distribution Flow: Game Download Path & Conversion Strategy",
              title: "围绕游戏下载、安装与召回链路，提升分发效率与转化率\nImprove distribution efficiency through download, install, and recall flows",
              subtitle: "",
              visual: "./assets/p2/dashen/dashen_05.webp",
              body: "该项目围绕游戏分发关系链展开，目标是解决自有分发渠道薄弱、公域与私域转化不足、下载链路不清晰等问题。\nThis project focused on game distribution, including weak owned channels, low conversion, and unclear download flows.\n\n我参与了从利益相关方分析、用户路径梳理到设计策略制定的过程，重点关注下载前、下载中、下载后的完整链路体验。\nI worked on stakeholder analysis, user flow mapping, and design strategy across the full download journey.\n\n设计拆解\nDesign Breakdown\n\n01｜内外部问题分析\n01｜Internal & External Issues\n\n从外部渠道竞争、用户流失、自有分发能力不足等问题出发，梳理当前分发链路面临的核心压力。\nIdentified key pressures from channel competition, user loss, and weak owned distribution.\n\n02｜利益相关方梳理\n02｜Stakeholder Mapping\n\n分析用户、渠道、平台、游戏内容池等角色之间的关系，明确不同节点在分发链路中的作用。\nMapped users, channels, platform, and game content pool within the distribution flow.\n\n03｜下载路径拆解\n03｜Download Journey Breakdown\n\n将用户路径拆分为下载前、下载中、下载后三个阶段，分别梳理曝光、进度感知、提醒、安装和召回场景。\nSplit the journey into pre-download, downloading, and post-download stages.\n\n04｜设计目标制定\n04｜Design Goals\n\n围绕提高效率、资源整合、多管齐下、串联场景等方向，制定分发链路设计目标。\nDefined goals around efficiency, resource integration, multi-channel reach, and scene connection.\n\n05｜链路闭环思维\n05｜Closed-loop Thinking\n\n将引流、下载、安装、分享重新串联，形成从触达到转化、再到二次传播的完整闭环。\nConnected traffic, download, install, and sharing into one conversion loop.\n\n结论\n\n该项目的核心价值，是从单点下载入口优化，升级为对完整分发链路的系统梳理与转化策略设计。\nThe value was moving from single-entry optimization to full distribution flow strategy."
            },
            {
              label: "06｜具体方案：曝光、预判、下载中心与安装优化",
              header: "06｜具体方案：曝光、预判、下载中心与安装优化\n06｜Solution: Exposure, Prediction, Download Center & Installation",
              title: "通过场景化入口、预判设计和状态管理，缩短用户行为路径\nShorten user paths through contextual entries, prediction, and state management",
              subtitle: "",
              visual: "./assets/p2/dashen/dashen_06.webp",
              body: "针对游戏下载链路，我从端内曝光、端外引流、下载中心、安装提醒和外部分享等多个场景进行方案拆解。\nI broke down the download flow across in-app exposure, external traffic, download center, install reminders, and sharing.\n\n核心思路不是单点增加入口，而是让用户在合适的时间看到合适的提醒，并能够顺利完成下载、安装和后续回访。\nThe idea was not just adding entries, but showing the right prompt at the right moment.\n\n设计拆解\nDesign Breakdown\n\n01｜提高曝光\n01｜Increase Exposure\n\n在顶部区域、圈子卡位、视频浏览页、发现页、活动页、公众号等位置设置下载入口，提升游戏分发触达率。\nAdded download entries across top areas, community cards, video pages, discovery pages, campaigns, and official accounts.\n\n02｜预判设计\n02｜Predictive Design\n\n根据用户下载路径、账户信息和安装状态，提前判断用户可能需要的下一步操作，并通过弹窗、端内提示或 Push 缩短路径。\nPredicted users' next steps based on download path, account info, and install status.\n\n03｜下载中心\n03｜Download Center\n\n设计一站式下载管理中心，区分已下载、已预约、更新中、可打开等状态，提升状态可见性和操作效率。\nDesigned a one-stop center for downloaded, reserved, updating, and openable states.\n\n04｜安装优化\n04｜Installation Optimization\n\n通过端内 Push、消息提醒、顶部栏提示等方式，及时提醒用户完成安装或更新，减少路径中断。\nUsed in-app push, messages, and top-bar prompts to reduce installation drop-off.\n\n05｜防拦截引导\n05｜Anti-block Guidance\n\n针对安装过程中的权限与拦截问题，通过明确提示和步骤引导，帮助用户完成必要设置。\nUsed clear prompts and step guidance to help users handle permission or blocking issues.\n\n06｜外部分享\n06｜External Sharing\n\n结合预约提醒和活动机制，引导用户在合适场景进行外部分享，带来新的下载入口。\nUsed reservation reminders and campaign mechanics to create new sharing-based download entries.\n\n结论\n\n通过多场景入口、预判设计和下载状态管理，该项目让游戏下载链路更清晰，也提高了用户从看到游戏到完成安装的转化可能性。\nThe project made the download flow clearer and improved the chance of conversion from exposure to installation."
            },
            {
              label: "07｜活动设计：阴阳师 N 卡觉醒",
              header: "07｜活动设计：阴阳师 N 卡觉醒\n07｜Campaign Design: Onmyoji N Card Awakening",
              title: "用仪式感、趣味化和细节反馈，增强活动代入感\nUse ritual, playfulness, and feedback to strengthen immersion",
              subtitle: "",
              visual: "./assets/p2/dashen/dashen_07.webp",
              body: "该项目是围绕《阴阳师》N 卡觉醒主题展开的活动设计。\nThis project was a campaign design based on the Onmyoji N Card Awakening theme.\n\n设计重点不只是完成活动流程，而是通过和风视觉、角色代入、互动反馈和收集机制，让用户在活动中获得更强的参与感与情绪记忆。\nThe focus was not only the flow, but also atmosphere, role immersion, interaction feedback, and collection motivation.\n\n设计拆解\nDesign Breakdown\n\n01｜仪式感\n01｜Sense of Ritual\n\n通过和风元素、庭院场景、角色选择和“敲鼓出发”等操作包装，强化玩家进入活动的氛围感。\nJapanese-style visuals, courtyard scenes, role choice, and drum-start actions build atmosphere.\n\n02｜角色代入\n02｜Role Immersion\n\n让用户以 N 卡身份参与活动，通过角色故事、觉醒流程和场景包装，增强玩家认同与归属感。\nUsers join as N cards, gaining identity through story, awakening flow, and scene design.\n\n03｜趣味化\n03｜Playful Interaction\n\n在答题、随机事件、角色故事和收集进度中加入游戏化表达，让活动更接近游戏体验，而不是普通运营页面。\nQuizzes, random events, character stories, and collection progress make the campaign feel more game-like.\n\n04｜细节反馈\n04｜Detail Feedback\n\n通过 Toast、弹窗、答题错误微震、状态提示等方式，及时反馈用户操作结果。\nToasts, popups, vibration, and state prompts give timely feedback.\n\n05｜信息布局\n05｜Information Layout\n\n将生命值、进度等关键状态放在更符合浏览习惯的位置，帮助用户快速理解当前任务状态。\nKey states such as HP and progress are placed where users can read them quickly.\n\n06｜收集激励\n06｜Collection Motivation\n\n通过画廊、收集进度和多样页面样式，激发用户的收集欲，减少重复答题过程中的视觉疲劳。\nGallery, progress, and varied page styles encourage collection and reduce repetition fatigue.\n\n结论\n\n该项目的核心价值，是将运营活动包装为更具游戏感和情绪记忆点的互动体验，让用户在完成任务的同时获得更强的代入感和参与感。\nThe value was turning an operation campaign into a more game-like and memorable interactive experience."
            }
          ]
        },
        {
          label: "产品走查",
          labelEn: "Design Review",
          icon: "design-review",
          pages: [
            {
              label: "产品走查",
              title: "网易大神 / Netease Godlike",
              subtitle: "Design Review",
              pdfEmbed: "./assets/p2/dashen/dashen_ppt.pdf",
              body: ""
            }
          ]
        },
        {
          label: "用户研究",
          labelEn: "User Research",
          icon: "user-research",
          pages: [
            {
              label: "01｜云游戏可用性测试：从试玩路径到悬浮球体验优化",
              header: "01｜可用性测试：云游戏试玩路径与用户理解\n01｜Usability Test: Cloud Gaming Trial Flow & User Understanding",
              title: "观察用户如何进入、理解并使用云游戏功能\nUnderstand how users enter, interpret, and use cloud gaming",
              subtitle: "",
              visual: "./assets/p2/dashen/diaoyan/ceshi_01.webp",
              body: "节选自网易大神云游戏相关可用性测试项目，部分信息因保密要求已做处理。\nSelected from a usability test for a cloud gaming feature; some details are adjusted for confidentiality.\n\n本次测试围绕网易大神中的云游戏体验展开，重点观察用户从首页入口进入云游戏、启动游戏、完成试玩任务，以及理解云游戏与完整客户端之间关系的过程。\nThis test focused on the cloud gaming experience in NetEase Godlike, observing how users enter from the homepage, launch games, complete trial tasks, and understand the relationship between cloud gaming and the full client.\n\n测试中，我关注的不只是用户是否能成功进入游戏，而是他们在关键节点上的理解成本：入口是否清晰、任务提示是否容易识别、云游戏中心与游戏服务之间的关系是否明确，以及用户是否能自然理解「试玩、下载完整客户端、领取奖励」等转化路径。\nBeyond whether users could enter the game, I focused on comprehension cost at key moments: entry clarity, task prompt recognition, the relationship between the cloud gaming center and game services, and whether users naturally understood the trial, download, and reward conversion path.\n\n设计拆解\nDesign Breakdown\n\n01｜入口理解\n01｜Entry Understanding\n\n从首页中的「游戏服务」「云游戏中心」等模块观察用户是否能快速判断云游戏入口，并理解其功能定位。\nObserved whether users could quickly identify cloud gaming entries from modules such as Game Services and Cloud Gaming Center.\n\n02｜启动流程\n02｜Launch Flow\n\n记录用户从点击游戏、进入启动页到正式进入云游戏的过程，关注加载等待、提示信息和操作反馈是否清晰。\nRecorded the journey from tapping a game through the launch screen into cloud gaming, focusing on loading wait, prompts, and feedback clarity.\n\n03｜任务与转化\n03｜Tasks & Conversion\n\n观察用户在试玩过程中是否能理解任务要求、下载完整客户端的价值，以及奖励领取路径是否具有吸引力和可执行性。\nObserved whether users understood trial tasks, the value of downloading the full client, and whether reward paths felt attractive and actionable."
            },
            {
              label: "02｜体验问题定位：悬浮球、反馈入口与下载转化",
              header: "02｜体验问题定位：悬浮球、反馈入口与下载转化\n02｜Issue Diagnosis: Floating Panel, Feedback Entry & Download Conversion",
              title: "将试玩中的关键操作集中到悬浮球，但需要降低理解与打断成本\nCentralize key actions in the floating panel while reducing friction",
              subtitle: "",
              visual: "./assets/p2/dashen/diaoyan/ceshi_02.webp",
              body: "在云游戏试玩过程中，悬浮球承担了多个关键功能，包括下载游戏、云玩反馈、画质/流畅度切换、声音开关和退出游戏。它是用户在云游戏环境中最重要的辅助操作入口。\nDuring cloud gaming trials, the floating panel handled download, cloud-play feedback, quality/smoothness switching, sound toggle, and exit — the most important auxiliary entry in the cloud gaming environment.\n\n但从测试观察来看，悬浮球同时承载了工具、反馈、设置和转化功能，信息密度较高。用户在试玩状态下更关注「我现在能不能继续玩」「画面是否流畅」「要不要下载完整客户端」，因此悬浮球的功能层级需要更清晰，避免在游戏过程中造成理解负担。\nTesting showed the panel carried tools, feedback, settings, and conversion at once with high information density. Users in trial mode cared more about whether they could keep playing, whether visuals were smooth, and whether to download the full client — so hierarchy needed to be clearer to avoid cognitive load mid-game.\n\n设计拆解\nDesign Breakdown\n\n01｜悬浮球功能分层\n01｜Floating Panel Hierarchy\n\n将高频操作与低频操作区分：例如画质、声音、退出属于即时操作；下载完整客户端和云玩反馈属于决策型操作，视觉层级不应完全相同。\nSeparated high-frequency actions (quality, sound, exit) from decision-based actions (full client download, cloud-play feedback) with distinct visual hierarchy.\n\n02｜反馈入口前置\n02｜Feedback Entry Visibility\n\n云游戏体验受网络、延迟和画质影响明显，因此「云玩反馈」需要保持可见，但表达应更像问题反馈入口，而不是普通功能按钮。\nCloud gaming is sensitive to network, latency, and quality — so Cloud Play Feedback should stay visible but read as a feedback entry, not a generic feature button.\n\n03｜下载转化说明\n03｜Download Conversion Messaging\n\n下载完整客户端的弹窗需要清楚说明用户能获得什么：更完整的游戏内容、更稳定的体验，以及奖励领取价值。转化文案应减少干扰感，强化「继续体验」的自然动机。\nThe full-client download dialog should clearly state what users gain: fuller content, a more stable experience, and reward value — with copy that feels less interruptive and more like a natural continuation.\n\n04｜体验结论\n04｜Research Takeaways\n\n本次测试的核心价值，是从真实用户操作中定位云游戏试玩链路中的理解断点，并将问题沉淀为可优化的产品方向：入口更清楚、启动更可预期、悬浮球更聚焦、下载转化更自然。\nThe core value was locating comprehension breakpoints in the trial flow from real user behavior, and turning findings into product directions: clearer entry, more predictable launch, a more focused floating panel, and more natural download conversion.\n\n结论\n\n云游戏不是单纯把游戏放进 App 中运行，而是需要重新设计一条低门槛、低打断、可转化的试玩体验路径。通过可用性测试，可以帮助团队发现用户在入口认知、试玩操作、悬浮球理解和客户端下载转化中的具体阻力，并为后续体验优化提供依据。\nCloud gaming is not simply running a game inside the app — it requires a low-barrier, low-interruption, conversion-friendly trial path. Usability testing helps teams find specific friction in entry cognition, trial operation, floating panel understanding, and client download conversion."
            }
          ]
        },
        {
          label: "产品规范",
          labelEn: "Product Guidelines",
          icon: "product-guidelines",
          pages: [
            {
              label: "01｜大神产品 UX 规范",
              header: "大神产品 UX 规范\nGodlike Product UX Guidelines",
              title: "沉淀交互规则与设计标准，提升团队协作效率\nBuild UX rules and standards to improve team collaboration",
              subtitle: "",
              visual: "./assets/p2/dashen/guifan/sd_1.webp",
              body: "在团队协作中，产品设计不只需要完成单个页面，也需要通过规范沉淀，让不同业务、不同设计师和上下游团队在同一套规则下协作。\nProduct design is not only about single-page delivery. Clear guidelines help designers, product teams, and developers work under shared rules.\n\n因此，我参与整理大神产品 UX 规范，围绕页面结构、交互状态、组件使用、文档表达和研发交付等内容，沉淀可复用的设计标准。\nSo I helped organize the Godlike Product UX Guidelines, covering page structure, interaction states, component usage, documentation, and development handoff.\n\n设计拆解\nDesign Breakdown\n\n01｜页面结构规范\n01｜Page Structure\n\n统一页面信息层级、模块排布和内容承载方式，帮助不同业务页面保持一致的阅读和操作逻辑。\nUnified page hierarchy, module layout, and content structure to keep pages consistent.\n\n02｜交互状态规范\n02｜Interaction States\n\n整理按钮、弹窗、缺省页、加载、错误、成功反馈等常见状态，降低设计遗漏和理解偏差。\nDefined common states such as buttons, popups, empty pages, loading, error, and success feedback.\n\n03｜组件使用规范\n03｜Component Usage\n\n明确组件在不同场景下的使用方式，避免相似功能重复设计，提高页面复用效率。\nClarified component usage across scenarios to reduce repeated design and improve reuse.\n\n04｜文档与交付规范\n04｜Documentation & Handoff\n\n规范交互文档表达方式，包括标注、流程说明、状态说明和异常情况，帮助研发更准确理解设计方案。\nStandardized interaction documents, including annotations, flows, states, and edge cases for clearer development handoff.\n\n结论\n\n这页的核心价值，是将零散的设计经验转化为团队可复用的产品 UX 规范，让设计方案更稳定，也让协作和落地更高效。\nThe value was turning scattered design experience into reusable UX guidelines, making design delivery more stable and efficient."
            },
            {
              label: "02｜大神产品 UX 规范",
              header: "大神产品 UX 规范\nGodlike Product UX Guidelines",
              title: "沉淀交互规则与设计标准，提升团队协作效率\nBuild UX rules and standards to improve team collaboration",
              subtitle: "",
              visual: "./assets/p2/dashen/guifan/sd_2.webp",
              body: "在团队协作中，产品设计不只需要完成单个页面，也需要通过规范沉淀，让不同业务、不同设计师和上下游团队在同一套规则下协作。\nProduct design is not only about single-page delivery. Clear guidelines help designers, product teams, and developers work under shared rules.\n\n因此，我参与整理大神产品 UX 规范，围绕页面结构、交互状态、组件使用、文档表达和研发交付等内容，沉淀可复用的设计标准。\nSo I helped organize the Godlike Product UX Guidelines, covering page structure, interaction states, component usage, documentation, and development handoff.\n\n设计拆解\nDesign Breakdown\n\n01｜页面结构规范\n01｜Page Structure\n\n统一页面信息层级、模块排布和内容承载方式，帮助不同业务页面保持一致的阅读和操作逻辑。\nUnified page hierarchy, module layout, and content structure to keep pages consistent.\n\n02｜交互状态规范\n02｜Interaction States\n\n整理按钮、弹窗、缺省页、加载、错误、成功反馈等常见状态，降低设计遗漏和理解偏差。\nDefined common states such as buttons, popups, empty pages, loading, error, and success feedback.\n\n03｜组件使用规范\n03｜Component Usage\n\n明确组件在不同场景下的使用方式，避免相似功能重复设计，提高页面复用效率。\nClarified component usage across scenarios to reduce repeated design and improve reuse.\n\n04｜文档与交付规范\n04｜Documentation & Handoff\n\n规范交互文档表达方式，包括标注、流程说明、状态说明和异常情况，帮助研发更准确理解设计方案。\nStandardized interaction documents, including annotations, flows, states, and edge cases for clearer development handoff.\n\n结论\n\n这页的核心价值，是将零散的设计经验转化为团队可复用的产品 UX 规范，让设计方案更稳定，也让协作和落地更高效。\nThe value was turning scattered design experience into reusable UX guidelines, making design delivery more stable and efficient."
            },
            {
              label: "03｜大神产品 UX 规范",
              header: "大神产品 UX 规范\nGodlike Product UX Guidelines",
              title: "沉淀交互规则与设计标准，提升团队协作效率\nBuild UX rules and standards to improve team collaboration",
              subtitle: "",
              visual: "./assets/p2/dashen/guifan/sd_3.webp",
              body: "在团队协作中，产品设计不只需要完成单个页面，也需要通过规范沉淀，让不同业务、不同设计师和上下游团队在同一套规则下协作。\nProduct design is not only about single-page delivery. Clear guidelines help designers, product teams, and developers work under shared rules.\n\n因此，我参与整理大神产品 UX 规范，围绕页面结构、交互状态、组件使用、文档表达和研发交付等内容，沉淀可复用的设计标准。\nSo I helped organize the Godlike Product UX Guidelines, covering page structure, interaction states, component usage, documentation, and development handoff.\n\n设计拆解\nDesign Breakdown\n\n01｜页面结构规范\n01｜Page Structure\n\n统一页面信息层级、模块排布和内容承载方式，帮助不同业务页面保持一致的阅读和操作逻辑。\nUnified page hierarchy, module layout, and content structure to keep pages consistent.\n\n02｜交互状态规范\n02｜Interaction States\n\n整理按钮、弹窗、缺省页、加载、错误、成功反馈等常见状态，降低设计遗漏和理解偏差。\nDefined common states such as buttons, popups, empty pages, loading, error, and success feedback.\n\n03｜组件使用规范\n03｜Component Usage\n\n明确组件在不同场景下的使用方式，避免相似功能重复设计，提高页面复用效率。\nClarified component usage across scenarios to reduce repeated design and improve reuse.\n\n04｜文档与交付规范\n04｜Documentation & Handoff\n\n规范交互文档表达方式，包括标注、流程说明、状态说明和异常情况，帮助研发更准确理解设计方案。\nStandardized interaction documents, including annotations, flows, states, and edge cases for clearer development handoff.\n\n结论\n\n这页的核心价值，是将零散的设计经验转化为团队可复用的产品 UX 规范，让设计方案更稳定，也让协作和落地更高效。\nThe value was turning scattered design experience into reusable UX guidelines, making design delivery more stable and efficient."
            },
            {
              label: "04｜大神产品 UX 规范",
              header: "大神产品 UX 规范\nGodlike Product UX Guidelines",
              title: "沉淀交互规则与设计标准，提升团队协作效率\nBuild UX rules and standards to improve team collaboration",
              subtitle: "",
              visual: "./assets/p2/dashen/guifan/sd_4.webp",
              body: "在团队协作中，产品设计不只需要完成单个页面，也需要通过规范沉淀，让不同业务、不同设计师和上下游团队在同一套规则下协作。\nProduct design is not only about single-page delivery. Clear guidelines help designers, product teams, and developers work under shared rules.\n\n因此，我参与整理大神产品 UX 规范，围绕页面结构、交互状态、组件使用、文档表达和研发交付等内容，沉淀可复用的设计标准。\nSo I helped organize the Godlike Product UX Guidelines, covering page structure, interaction states, component usage, documentation, and development handoff.\n\n设计拆解\nDesign Breakdown\n\n01｜页面结构规范\n01｜Page Structure\n\n统一页面信息层级、模块排布和内容承载方式，帮助不同业务页面保持一致的阅读和操作逻辑。\nUnified page hierarchy, module layout, and content structure to keep pages consistent.\n\n02｜交互状态规范\n02｜Interaction States\n\n整理按钮、弹窗、缺省页、加载、错误、成功反馈等常见状态，降低设计遗漏和理解偏差。\nDefined common states such as buttons, popups, empty pages, loading, error, and success feedback.\n\n03｜组件使用规范\n03｜Component Usage\n\n明确组件在不同场景下的使用方式，避免相似功能重复设计，提高页面复用效率。\nClarified component usage across scenarios to reduce repeated design and improve reuse.\n\n04｜文档与交付规范\n04｜Documentation & Handoff\n\n规范交互文档表达方式，包括标注、流程说明、状态说明和异常情况，帮助研发更准确理解设计方案。\nStandardized interaction documents, including annotations, flows, states, and edge cases for clearer development handoff.\n\n结论\n\n这页的核心价值，是将零散的设计经验转化为团队可复用的产品 UX 规范，让设计方案更稳定，也让协作和落地更高效。\nThe value was turning scattered design experience into reusable UX guidelines, making design delivery more stable and efficient."
            }
          ]
        }
      ]
    },
    {
      year: "2022",
      title: "LANDS OF EMPIRES",
      subtitle: "Architect Information System of SLG",
      intro: "",
      caseStudy: "保持黑金调性，强调项目图形在时间轴节点中的识别性与节奏感。",
      role: "Game Visual / Interaction Prototype",
      tools: "Photoshop / Figma / HTML / CSS",
      outcome: "将项目主图替换进时间轴并保留原有滚动驱动动画。",
      visual: "./assets/p2/loe/constract/loeppt_1.webp",
      visualNav: true,
      collapsibleSections: true,
      sections: [
        {
          label: "城建系统",
          labelEn: "Construct System",
          icon: "construct",
          pages: [
        {
          label: "项目概览：复杂 SLG 城内建筑的信息系统重构",
          header: "01｜项目概览：复杂 SLG 城内建筑的信息系统重构\n01｜Project Overview: Complex SLG City Building Information System Redesign",
          title: "城内建筑信息系统｜从建筑入口到战略操作循环\nCity Building Info System｜From Entry Points to Strategic Loops",
          subtitle: "",
          visual: "./assets/p2/loe/constract/loeppt_1.webp",
          introSections: [
            {
              type: "text",
              text:
                "在类 COK-like 混合型 SLG 中，城内建筑不仅是视觉场景的一部分，更是训练、升级、资源收取、状态监控等战略操作的入口。\nIn COK-like hybrid SLGs, city buildings are not just visuals—they serve as entry points for training, upgrades, resource collection, and status monitoring.\n\n本项目的核心目标，是在多建筑、多状态、多操作并存的城内场景中，建立一套清晰的信息层级与操作反馈机制，让玩家能够快速识别建筑状态、完成高频操作，并顺畅进入下一轮循环。\nThe core goal is to create a clear information hierarchy and feedback system in multi-building, multi-status environments, enabling players to quickly recognize building states, perform frequent actions, and smoothly continue the gameplay loop."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "role",
              heading: "我的职责：\nMy Role:",
              text:
                "负责城内建筑信息架构、一级/二级界面交互逻辑、建筑状态反馈、操作链路与感官反馈设计。\nResponsible for city building info architecture, Level 1 & 2 interface interaction logic, building state feedback, action flows, and sensory feedback design."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "challenge",
              heading: "设计挑战：\nDesign Challenges:",
              text:
                "建筑状态复杂：空闲、任务中、可领取、可协助、可升级、升级中、升级完成等状态并存。\nComplex Building States: idle, in-task, collectible, assistable, upgradable, upgrading, upgrade completed.\n\n操作频率高：训练、收取、升级、补资源等行为需要反复循环。\nHigh Action Frequency: training, collecting, upgrading, resupplying repeat frequently.\n\n信息层级多：一级界面需要快速感知，二级界面需要承载详细配置与数据查看。\nMultiple Info Layers: Level 1 for quick perception, Level 2 for detailed configuration & data viewing.\n\n场景沉浸要求高：UI 反馈不能割裂于游戏画面，需要与建筑表现、动效、音效共同形成体验。\nHigh Immersion Requirement: UI feedback must integrate with visuals, animations, and sounds to maintain immersion."
            }
          ],
          body: "在类 COK-like 混合型 SLG 中，城内建筑不仅是视觉场景的一部分，更是训练、升级、资源收取、状态监控等战略操作的入口。\nIn COK-like hybrid SLGs, city buildings are not just visuals—they serve as entry points for training, upgrades, resource collection, and status monitoring.\n\n本项目的核心目标，是在多建筑、多状态、多操作并存的城内场景中，建立一套清晰的信息层级与操作反馈机制，让玩家能够快速识别建筑状态、完成高频操作，并顺畅进入下一轮循环。\nThe core goal is to create a clear information hierarchy and feedback system in multi-building, multi-status environments, enabling players to quickly recognize building states, perform frequent actions, and smoothly continue the gameplay loop.\n\n我的职责：\n负责城内建筑信息架构、一级/二级界面交互逻辑、建筑状态反馈、操作链路与感官反馈设计。\nMy Role:\nResponsible for city building info architecture, Level 1 & 2 interface interaction logic, building state feedback, action flows, and sensory feedback design.\n\n设计挑战：\n\n建筑状态复杂：空闲、任务中、可领取、可协助、可升级、升级中、升级完成等状态并存。\nComplex Building States: idle, in-task, collectible, assistable, upgradable, upgrading, upgrade completed.\n\n操作频率高：训练、收取、升级、补资源等行为需要反复循环。\nHigh Action Frequency: training, collecting, upgrading, resupplying repeat frequently.\n\n信息层级多：一级界面需要快速感知，二级界面需要承载详细配置与数据查看。\nMultiple Info Layers: Level 1 for quick perception, Level 2 for detailed configuration & data.\n\n场景沉浸要求高：UI 反馈不能割裂于游戏画面，需要与建筑表现、动效、音效共同形成体验。\nHigh Immersion Requirement: UI feedback must integrate with visuals, animations, and sounds to maintain immersion."
        },
        {
          label: "设计指针：从复杂系统中提炼交互原则",
          header: "02｜设计指针：从复杂系统中提炼交互原则\n02｜Design Guidelines: Extract Interaction Principles from Complex Systems",
          title: "一级迅捷，二级专业：建立城内建筑的信息承载策略\nFast First-Level, Professional Second-Level: City Building Information Strategy",
          subtitle: "",
          visual: "./assets/p2/loe/constract/loeppt_2.webp",
          introSections: [
            {
              type: "text",
              text:
                "在城内建筑系统中，玩家需要同时处理建筑状态、升级条件、资源收取、训练配置等信息。\nPlayers manage building status, upgrades, resources, and training simultaneously.\n\n因此，我将设计策略拆分为两层：一级界面负责快速感知与即时操作，二级界面负责深度配置与数据理解。\nThus, design is split into two layers: Level 1 for quick perception & instant actions, Level 2 for detailed configuration & data understanding."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "guidelines",
              heading: "设计指针\nDesign Guidelines",
              text:
                "01 迅速感知\n确保玩家能在城内场景中快速判断建筑是否可操作。\nFocus on letting players quickly identify actionable buildings.\n重点解决信息可读性与状态易读性。\nKey: readability & status clarity.\n\n02 操作便捷\n减少高频行为的操作路径，让训练、收取、升级等动作能够快速完成并进入下一轮循环。\nStreamline frequent actions—training, collecting, upgrading—for fast loops.\n重点解决便捷性与循环性。\nKey: convenience & gameplay loop.\n\n03 情感沉浸\n让 UI 反馈尽量与建筑表现、动效、音效结合，避免界面与游戏场景割裂。\nIntegrate UI feedback with visuals, animations, and sound to stay immersive.\n重点解决降噪性与心流沉浸感。\nKey: reduce noise & maintain flow."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "direction",
              heading: "设计方向\nDesign Direction",
              text:
                "城内一级界面｜迅捷\n用于承载建筑状态感知与轻量操作。\nLevel 1｜Fast: supports building status and lightweight actions.\n玩家可以在城内界面快速判断状态、完成收取/升级入口点击，并继续监控整体城市运转。\nPlayers can quickly check status, collect or upgrade, and continue monitoring city operations.\n\n城内二级界面｜专业\n用于承载建筑系统配置与数据查看。\nLevel 2｜Professional: supports detailed configuration & data viewing.\n当玩家需要训练兵种、调整参数、查看属性或处理复杂操作时，进入二级界面完成更精细的操作。\nFor training troops, adjusting parameters, or complex tasks, players use Level 2 for precise control."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "conclusion",
              heading: "结论\nConclusion",
              text:
                "一级界面解决「我现在能不能做」，二级界面解决「我要怎么具体做」。\nLevel 1 answers \"Can I act now?\" Level 2 answers \"How exactly do I act?\""
            }
          ],
          body: "在城内建筑系统中，玩家需要同时处理建筑状态、升级条件、资源收取、训练配置等信息。\nPlayers manage building status, upgrades, resources, and training simultaneously.\n\n因此，我将设计策略拆分为两层：一级界面负责快速感知与即时操作，二级界面负责深度配置与数据理解。\nThus, design is split into two layers: Level 1 for quick perception & instant actions, Level 2 for detailed configuration & data understanding.\n\n设计指针\n\n01 迅速感知\n确保玩家能在城内场景中快速判断建筑是否可操作。\nFocus on letting players quickly identify actionable buildings.\n重点解决信息可读性与状态易读性。\nKey: readability & status clarity.\n\n02 操作便捷\n减少高频行为的操作路径，让训练、收取、升级等动作能够快速完成并进入下一轮循环。\nStreamline frequent actions—training, collecting, upgrading—for fast loops.\n重点解决便捷性与循环性。\nKey: convenience & gameplay loop.\n\n03 情感沉浸\n让 UI 反馈尽量与建筑表现、动效、音效结合，避免界面与游戏场景割裂。\nIntegrate UI feedback with visuals, animations, and sound to stay immersive.\n重点解决降噪性与心流沉浸感。\nKey: reduce noise & maintain flow.\n\n设计方向\n\n城内一级界面｜迅捷\n用于承载建筑状态感知与轻量操作。\nLevel 1｜Fast: supports building status and lightweight actions.\n玩家可以在城内界面快速判断状态、完成收取/升级入口点击，并继续监控整体城市运转。\nPlayers can quickly check status, collect or upgrade, and continue monitoring city operations.\n\n城内二级界面｜专业\n用于承载建筑系统配置与数据查看。\nLevel 2｜Professional: supports detailed configuration & data viewing.\n当玩家需要训练兵种、调整参数、查看属性或处理复杂操作时，进入二级界面完成更精细的操作。\nFor training troops, adjusting parameters, or complex tasks, players use Level 2 for precise control.\n\n结论\n一级界面解决「我现在能不能做」，二级界面解决「我要怎么具体做」。\nLevel 1 answers \"Can I act now?\" Level 2 answers \"How exactly do I act?\""
        },
        {
          label: "操作链路：长短流程并存的建筑闭环系统",
          header: "03｜操作链路：长短流程并存的建筑闭环系统\n03｜Operation Flow: Short & Long Building Loops",
          title: "让高频操作快速完成，让复杂操作不中断\nFast for frequent actions, guided for complex actions",
          subtitle: "",
          visual: "./assets/p2/loe/constract/loeppt_3.webp",
          introSections: [
            {
              type: "text",
              text:
                "SLG 城内建筑操作具有明显的循环性。玩家会反复经历「看到状态 → 执行操作 → 获得结果 → 回到城内继续下一轮」的过程。\nSLG building actions repeat in a clear loop: see status → act → get result → return to the city.\n\n因此，我将建筑操作拆分为短流程与长流程：短流程服务于高频即时操作，长流程服务于条件不足或需要深度配置的操作。\nSo I divided the flow into short loops for instant actions and long loops for guided, complex actions."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "short-flow",
              heading: "短流程｜高频行为快速闭环\nShort Flow｜Fast Loop for Frequent Actions",
              text:
                "当建筑状态明确，且当前条件满足时，玩家可以直接在一级界面完成操作。\nWhen status is clear and conditions are met, players act directly on Level 1.\n\n例如：事件提醒 → 状态感知 → 领取结果。\nExample: event reminder → status check → collect result.\n\n训练链路中也会出现：可训状态 → 开始训练 → 状态感知 → 领取结果。\nTraining loop: trainable → start training → status check → collect result."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "long-flow",
              heading: "长流程｜复杂行为引导完成\nLong Flow｜Guided Completion for Complex Actions",
              text:
                "当玩家想进行升级、训练配置或资源补充，但条件不满足时，系统通过一级弹窗或二级界面引导玩家完成补充操作。\nWhen conditions are not met, popups or Level 2 guide players to complete the missing steps.\n\n例如：升级条件不足 → 跳转其他建筑 / 补充物资 → 回到升级链路。\nExample: upgrade blocked → go to another building / refill resources → return to upgrade."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "state",
              heading: "状态承载\nState Distribution",
              text:
                "一级界面承载：事件提醒、状态感知、领取结果。\nLevel 1: reminders, status, collection.\n\n二级界面承载：调整兵种、调配参数、补充物资、其他设置。\nLevel 2: troop settings, parameters, resources, advanced settings.\n\n一级弹窗承载：跳转建筑、补充物资、数据对照等辅助信息。\nLevel 1 popup: building jump, resource refill, data comparison."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "conclusion",
              heading: "结论\nConclusion",
              text:
                "短流程保证效率，长流程保证完整性；二者共同形成城内建筑的重复操作闭环。\nShort flows ensure speed; long flows ensure completion. Together, they form a repeatable building loop."
            }
          ],
          body: "SLG 城内建筑操作具有明显的循环性。玩家会反复经历「看到状态 → 执行操作 → 获得结果 → 回到城内继续下一轮」的过程。\nSLG building actions repeat in a clear loop: see status → act → get result → return to the city.\n\n因此，我将建筑操作拆分为短流程与长流程：短流程服务于高频即时操作，长流程服务于条件不足或需要深度配置的操作。\nSo I divided the flow into short loops for instant actions and long loops for guided, complex actions.\n\n短流程｜高频行为快速闭环\nShort Flow｜Fast Loop for Frequent Actions\n\n当建筑状态明确，且当前条件满足时，玩家可以直接在一级界面完成操作。\nWhen status is clear and conditions are met, players act directly on Level 1.\n\n例如：事件提醒 → 状态感知 → 领取结果。\nExample: event reminder → status check → collect result.\n\n训练链路中也会出现：可训状态 → 开始训练 → 状态感知 → 领取结果。\nTraining loop: trainable → start training → status check → collect result.\n\n长流程｜复杂行为引导完成\nLong Flow｜Guided Completion for Complex Actions\n\n当玩家想进行升级、训练配置或资源补充，但条件不满足时，系统通过一级弹窗或二级界面引导玩家完成补充操作。\nWhen conditions are not met, popups or Level 2 guide players to complete the missing steps.\n\n例如：升级条件不足 → 跳转其他建筑 / 补充物资 → 回到升级链路。\nExample: upgrade blocked → go to another building / refill resources → return to upgrade.\n\n状态承载\nState Distribution\n\n一级界面承载：事件提醒、状态感知、领取结果。\nLevel 1: reminders, status, collection.\n\n二级界面承载：调整兵种、调配参数、补充物资、其他设置。\nLevel 2: troop settings, parameters, resources, advanced settings.\n\n一级弹窗承载：跳转建筑、补充物资、数据对照等辅助信息。\nLevel 1 popup: building jump, resource refill, data comparison.\n\n结论\n短流程保证效率，长流程保证完整性；二者共同形成城内建筑的重复操作闭环。\nShort flows ensure speed; long flows ensure completion. Together, they form a repeatable building loop."
        },
        {
          label: "具体方案：城内一级界面的快速感知与即时操作",
          header: "04｜具体方案：城内一级界面的快速感知与即时操作\n04｜Solution: Fast Perception & Instant Actions on Level 1",
          title: "把建筑状态放回城内场景，让玩家一眼判断下一步\nBring building status back into the city view",
          subtitle: "",
          visual: "./assets/p2/loe/constract/loeppt_4.webp",
          introSections: [
            {
              type: "text",
              text:
                "城内一级界面承担的是「快速判断」和「轻量操作」。\nLevel 1 focuses on quick judgment and lightweight actions.\n\n玩家不应该进入多层界面后才知道建筑是否可领取、是否可升级、是否处于任务中。\nPlayers should not enter multiple screens just to know if a building is collectible, upgradable, or busy.\n\n因此，我将建筑状态直接映射到城内建筑表现与快捷操作入口上，让状态感知发生在玩家浏览城市的第一眼。\nSo I mapped building states directly onto city visuals and quick action entries."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "state-types",
              heading: "状态区分\nState Types",
              text:
                "建筑功能状态\nFunctional Status\n\n用于表达建筑当前是否有可执行操作。\nShows whether the building has available actions.\n\n例如：空闲中、任务中、可领取、可协助。\nExamples: idle, in task, collectible, assistable.\n\n建筑固有升级状态\nUpgrade Status\n\n用于表达建筑自身成长进度。\nShows the building's growth progress.\n\n例如：可升级、升级中、升级完成。\nExamples: upgradable, upgrading, upgrade completed."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "solution",
              heading: "关键方案 01｜状态感知前置\nKey Solution 01｜Front-load Status Perception",
              text:
                "通过建筑上方图标、倒计时、资源/奖励提示，让玩家在城内界面直接判断建筑当前状态。\nUse icons, timers, and reward/resource hints above buildings.\n\n可领取、任务中、升级中等状态不再依赖详情页解释，而是在主城浏览时即可被识别。\nCollectible, busy, and upgrading states become visible directly in the city view."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "solution",
              heading: "关键方案 02｜快捷操作入口\nKey Solution 02｜Quick Action Entry",
              text:
                "针对高频操作，如收取、升级、治疗等，在建筑点击后提供轻量操作入口，减少玩家在多个页面之间反复跳转的成本。\nFor frequent actions like collecting, upgrading, and healing, provide lightweight entries after tapping buildings."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "solution",
              heading: "关键方案 03｜升级条件引导\nKey Solution 03｜Upgrade Condition Guidance",
              text:
                "当玩家不满足升级条件时，通过一级弹窗提供明确的跳转提示，引导玩家前往对应建筑或补充物资。\nWhen upgrade conditions are missing, Level 1 popups guide players to the right building or resource refill.\n\n这样可以避免流程中断，让玩家继续保持目标感。\nThis prevents interruption and keeps players goal-oriented."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "value",
              heading: "设计价值\nDesign Value",
              text:
                "一级界面让玩家快速判断「当前有什么可做」，并用最短路径完成轻量操作；当条件不足时，系统继续提供下一步方向，而不是让玩家停在失败状态。\nLevel 1 helps players know \"what can I do now,\" complete light actions fast, and receive clear next steps when blocked."
            }
          ],
          body: "城内一级界面承担的是「快速判断」和「轻量操作」。\nLevel 1 focuses on quick judgment and lightweight actions.\n\n玩家不应该进入多层界面后才知道建筑是否可领取、是否可升级、是否处于任务中。\nPlayers should not enter multiple screens just to know if a building is collectible, upgradable, or busy.\n\n因此，我将建筑状态直接映射到城内建筑表现与快捷操作入口上，让状态感知发生在玩家浏览城市的第一眼。\nSo I mapped building states directly onto city visuals and quick action entries.\n\n状态区分\nState Types\n\n建筑功能状态\nFunctional Status\n\n用于表达建筑当前是否有可执行操作。\nShows whether the building has available actions.\n\n例如：空闲中、任务中、可领取、可协助。\nExamples: idle, in task, collectible, assistable.\n\n建筑固有升级状态\nUpgrade Status\n\n用于表达建筑自身成长进度。\nShows the building's growth progress.\n\n例如：可升级、升级中、升级完成。\nExamples: upgradable, upgrading, upgrade completed.\n\n关键方案 01｜状态感知前置\nKey Solution 01｜Front-load Status Perception\n\n通过建筑上方图标、倒计时、资源/奖励提示，让玩家在城内界面直接判断建筑当前状态。\nUse icons, timers, and reward/resource hints above buildings.\n\n可领取、任务中、升级中等状态不再依赖详情页解释，而是在主城浏览时即可被识别。\nCollectible, busy, and upgrading states become visible directly in the city view.\n\n关键方案 02｜快捷操作入口\nKey Solution 02｜Quick Action Entry\n\n针对高频操作，如收取、升级、治疗等，在建筑点击后提供轻量操作入口，减少玩家在多个页面之间反复跳转的成本。\nFor frequent actions like collecting, upgrading, and healing, provide lightweight entries after tapping buildings.\n\n关键方案 03｜升级条件引导\nKey Solution 03｜Upgrade Condition Guidance\n\n当玩家不满足升级条件时，通过一级弹窗提供明确的跳转提示，引导玩家前往对应建筑或补充物资。\nWhen upgrade conditions are missing, Level 1 popups guide players to the right building or resource refill.\n\n这样可以避免流程中断，让玩家继续保持目标感。\nThis prevents interruption and keeps players goal-oriented.\n\n设计价值\nDesign Value\n\n一级界面让玩家快速判断「当前有什么可做」，并用最短路径完成轻量操作；当条件不足时，系统继续提供下一步方向，而不是让玩家停在失败状态。\nLevel 1 helps players know \"what can I do now,\" complete light actions fast, and receive clear next steps when blocked."
        },
        {
          label: "具体方案：兵营二级界面的空间化操作模型",
          header: "05｜具体方案：兵营二级界面的空间化操作模型\n05｜Solution: Spatial Operation Model for Barracks Level 2",
          title: "用 X / Y / Z 轴组织复杂配置、浏览行为与反馈层级\nUse X / Y / Z axes to organize complex operations",
          subtitle: "",
          visual: "./assets/p2/loe/constract/loeppt_5.webp",
          introSections: [
            {
              type: "text",
              text:
                "兵营二级界面承载训练兵种、参数查看、资源消耗、数量调整等更深层操作。\nThe barracks Level 2 supports troop training, data viewing, resource cost, and quantity adjustment.\n\n相比一级界面的快速感知，二级界面需要同时处理信息浏览、精细配置与结果反馈。\nUnlike Level 1, Level 2 handles browsing, precise configuration, and feedback.\n\n因此，我将界面理解为一个空间化操作模型，通过 X / Y / Z 三个方向组织信息与行为。\nSo I treated it as a spatial model using X / Y / Z axes."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "axis-x",
              heading: "X 轴｜核心信息排布\nX Axis｜Core Information Layout",
              text:
                "横向布局用于组织核心信息区。\nHorizontal layout organizes core information.\n\n兵种卡片、属性数据、训练需求与操作按钮在横向空间中形成稳定的信息关系，帮助玩家快速定位核心操作区域。\nTroop cards, stats, requirements, and action buttons form a stable relationship across the horizontal space.\n\n横向手势与切换动画用于承接不同兵种或信息模块的切换。\nHorizontal gestures and transitions support troop or module switching."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "axis-y",
              heading: "Y 轴｜纵向浏览行为\nY Axis｜Vertical Browsing",
              text:
                "纵向用于承接详细信息的延展。\nVertical space extends detailed information.\n\n属性说明、训练需求、补充信息等沿 Y 轴向下展开，符合移动端从上到下的阅读习惯。\nStats, requirements, and extra details expand downward, matching mobile reading habits.\n\n这样既能保证主操作区稳定，又能容纳更完整的数据内容。\nThis keeps the main action area stable while allowing more data."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "axis-z",
              heading: "Z 轴｜信息层级与反馈层\nZ Axis｜Hierarchy & Feedback Layers",
              text:
                "Z 轴用于区分画面层、UI 层、toast/弹窗层。\nZ axis separates scene, UI, toast, and popup layers.\n\n建筑场景与角色属于画面层，常规操作属于 UI 层，警示、提醒、谨慎操作确认进入更高层级。\nScene and characters stay at the visual layer; actions stay at UI layer; warnings and confirmations move above.\n\n通过 Z 轴拉开层级，玩家可以清楚知道当前关注点和操作优先级。\nThis helps players understand focus and priority."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "solution",
              heading: "关键方案 01｜Z 型阅读路线\nKey Solution 01｜Z-shaped Reading Path",
              text:
                "左中右布局承载核心信息，符合移动端操作需求。\nLeft-center-right layout supports key information and mobile use.\n\n主视觉区域用于展示兵种与建筑场景，右侧承载参数与操作按钮，形成清晰的阅读与操作路径。\nThe main visual area shows troops and scene; the right side holds parameters and actions."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "solution",
              heading: "关键方案 02｜纵横行为区分\nKey Solution 02｜Vertical & Horizontal Behavior Split",
              text:
                "纵向排布用于信息浏览，横向切换用于信息模块切换。\nVertical layout supports reading; horizontal switching supports modules.\n\n纵向强调易读性，横向强调视觉核心区与操作切换。\nVertical means readability; horizontal means focus and switching."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "solution",
              heading: "关键方案 03｜景深与跳转反馈\nKey Solution 03｜Depth & Navigation Feedback",
              text:
                "补充资源、跳转建筑、警示提醒等操作通过弹窗、toast 或引导层进行反馈，避免玩家在复杂配置中迷失。\nResource refill, building jump, and warnings use popups, toasts, or guide layers to prevent confusion."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "solution",
              heading: "关键方案 04｜微交互与谨慎操作\nKey Solution 04｜Micro-interactions & Risk Control",
              text:
                "数量调整同时支持模糊操作与精细操作。\nQuantity adjustment supports both quick and precise control.\n\n解散兵种等高风险行为使用强确认弹窗，降低误操作带来的损失。\nHigh-risk actions like dismissing troops use strong confirmation popups."
            },
            { type: "divider" },
            {
              type: "section",
              icon: "conclusion",
              heading: "结论\nConclusion",
              text:
                "二级界面不是简单的信息堆叠，而是通过 X/Y/Z 轴建立「信息排布、浏览行为、反馈层级」的空间化操作系统。\nLevel 2 is not information stacking; it is a spatial system for layout, browsing, and feedback hierarchy."
            }
          ],
          body: "兵营二级界面承载训练兵种、参数查看、资源消耗、数量调整等更深层操作。\nThe barracks Level 2 supports troop training, data viewing, resource cost, and quantity adjustment.\n\n相比一级界面的快速感知，二级界面需要同时处理信息浏览、精细配置与结果反馈。\nUnlike Level 1, Level 2 handles browsing, precise configuration, and feedback.\n\n因此，我将界面理解为一个空间化操作模型，通过 X / Y / Z 三个方向组织信息与行为。\nSo I treated it as a spatial model using X / Y / Z axes.\n\nX 轴｜核心信息排布\nX Axis｜Core Information Layout\n\n横向布局用于组织核心信息区。\nHorizontal layout organizes core information.\n\n兵种卡片、属性数据、训练需求与操作按钮在横向空间中形成稳定的信息关系，帮助玩家快速定位核心操作区域。\nTroop cards, stats, requirements, and action buttons form a stable relationship across the horizontal space.\n\n横向手势与切换动画用于承接不同兵种或信息模块的切换。\nHorizontal gestures and transitions support troop or module switching.\n\nY 轴｜纵向浏览行为\nY Axis｜Vertical Browsing\n\n纵向用于承接详细信息的延展。\nVertical space extends detailed information.\n\n属性说明、训练需求、补充信息等沿 Y 轴向下展开，符合移动端从上到下的阅读习惯。\nStats, requirements, and extra details expand downward, matching mobile reading habits.\n\n这样既能保证主操作区稳定，又能容纳更完整的数据内容。\nThis keeps the main action area stable while allowing more data.\n\nZ 轴｜信息层级与反馈层\nZ Axis｜Hierarchy & Feedback Layers\n\nZ 轴用于区分画面层、UI 层、toast/弹窗层。\nZ axis separates scene, UI, toast, and popup layers.\n\n建筑场景与角色属于画面层，常规操作属于 UI 层，警示、提醒、谨慎操作确认进入更高层级。\nScene and characters stay at the visual layer; actions stay at UI layer; warnings and confirmations move above.\n\n通过 Z 轴拉开层级，玩家可以清楚知道当前关注点和操作优先级。\nThis helps players understand focus and priority.\n\n关键方案 01｜Z 型阅读路线\nKey Solution 01｜Z-shaped Reading Path\n\n左中右布局承载核心信息，符合移动端操作需求。\nLeft-center-right layout supports key information and mobile use.\n\n主视觉区域用于展示兵种与建筑场景，右侧承载参数与操作按钮，形成清晰的阅读与操作路径。\nThe main visual area shows troops and scene; the right side holds parameters and actions.\n\n关键方案 02｜纵横行为区分\nKey Solution 02｜Vertical & Horizontal Behavior Split\n\n纵向排布用于信息浏览，横向切换用于信息模块切换。\nVertical layout supports reading; horizontal switching supports modules.\n\n纵向强调易读性，横向强调视觉核心区与操作切换。\nVertical means readability; horizontal means focus and switching.\n\n关键方案 03｜景深与跳转反馈\nKey Solution 03｜Depth & Navigation Feedback\n\n补充资源、跳转建筑、警示提醒等操作通过弹窗、toast 或引导层进行反馈，避免玩家在复杂配置中迷失。\nResource refill, building jump, and warnings use popups, toasts, or guide layers to prevent confusion.\n\n关键方案 04｜微交互与谨慎操作\nKey Solution 04｜Micro-interactions & Risk Control\n\n数量调整同时支持模糊操作与精细操作。\nQuantity adjustment supports both quick and precise control.\n\n解散兵种等高风险行为使用强确认弹窗，降低误操作带来的损失。\nHigh-risk actions like dismissing troops use strong confirmation popups.\n\n结论\n二级界面不是简单的信息堆叠，而是通过 X/Y/Z 轴建立「信息排布、浏览行为、反馈层级」的空间化操作系统。\nLevel 2 is not information stacking; it is a spatial system for layout, browsing, and feedback hierarchy."
        }
          ]
        },
        {
          label: "邮箱系统",
          labelEn: "Mail system",
          icon: "mail",
          pages: [
            {
              label: "邮箱基础系统：从功能分类到高拓展布局",
              header: "01｜邮箱基础系统：从功能分类到高拓展布局\n01｜Mail System: From Function Categories to Scalable Layout",
              title: "为多类型邮件建立可拓展的信息承载框架\nBuild a scalable framework for multiple mail types",
              subtitle: "",
              visual: "./assets/p2/loe/mail/mail_01.webp",
              introSections: [
                {
                  type: "text",
                  text:
                    "SLG 邮箱不仅承担系统通知，也承载资源领取、工会事务、个人消息、战斗报告和收藏管理等多种功能。\nIn SLG games, mail supports notifications, rewards, guild affairs, personal messages, battle reports, and saved content.\n\n因此，我首先根据策划案梳理邮箱中不同类型邮件的使用场景，将邮箱拆分为系统、个人、工会、战斗、收藏五类 Tab，确保后续内容能够在统一框架下持续拓展。\nSo I divided mail into five tabs: System, Personal, Guild, Battle, and Favorites, allowing future content to expand within one framework."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "guidelines",
                  heading: "01｜大 Tab 分类\n01｜Main Tab Categories",
                  text:
                    "根据邮件来源与玩家使用目的，将邮箱拆分为五类入口：系统、个人、工会、战斗、收藏。\nMail is divided by source and user purpose: System, Personal, Guild, Battle, Favorites.\n\n不同 Tab 对应不同用户心智，例如系统通知、个人沟通、工会事务、战斗复盘和长期保存。\nEach tab matches a clear user mindset: notification, communication, guild affairs, battle review, and saving."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "direction",
                  heading: "02｜列表与详情分区\n02｜List & Detail Split",
                  text:
                    "邮箱采用左侧列表、右侧详情的结构。\nThe mail uses a left-list and right-detail structure.\n\n左侧用于快速浏览和定位邮件，右侧用于承载邮件正文、奖励信息、战斗报告等核心内容。\nThe left side supports quick browsing; the right side carries core content."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "solution",
                  heading: "03｜3:7 信息比例\n03｜3:7 Information Ratio",
                  text:
                    "列表区作为辅助定位区，详情区作为核心视觉区。\nThe list is for navigation; the detail area is the main content zone.\n\n通过 3:7 的空间划分，让玩家既能快速切换邮件，又能获得完整内容展示。\nA 3:7 layout supports fast switching and full content display."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "solution",
                  heading: "04｜预留拓展能力\n04｜Scalable Detail Area",
                  text:
                    "详情区不做固定内容限制，而是作为可变形区域，根据系统邮件、战斗邮件、奖励邮件等不同内容进行扩展。\nThe detail area stays flexible for system mail, battle mail, reward mail, and more."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "conclusion",
                  heading: "结论\nConclusion",
                  text:
                    "邮箱基础系统的核心不是单个页面样式，而是建立一套可以承载多类型邮件、支持后续内容拓展的基础信息框架。\nThe core is not one page style, but a scalable framework for multiple mail types."
                }
              ],
              body: ""
            },
            {
              label: "战绩邮件：从玩家需求拆解展示元素",
              header: "02｜战绩邮件：从玩家需求拆解展示元素\n02｜Battle Mail: Breaking Down Player Needs",
              title: "把战报从「结果通知」设计成「策略复盘工具」\nTurn battle reports into strategy review tools",
              subtitle: "",
              visual: "./assets/p2/loe/mail/mail_02.webp",
              introSections: [
                {
                  type: "text",
                  text:
                    "战绩邮件的信息量远高于普通邮件。玩家打开战报时，不只想知道「赢了还是输了」，还需要理解战斗类型、战损战获、双方差距、增益影响和失败原因。\nBattle mail contains more information than normal mail. Players need more than win or loss; they need type, losses, gains, gaps, buffs, and reasons.\n\n因此，我将战绩邮件的信息目标拆分为两类：快速获知战况，以及进一步判断胜负原因。\nSo I split its goal into two parts: quick battle understanding and deeper result analysis."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "guidelines",
                  heading: "用户期待信息\nUser Needs",
                  text: ""
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "challenge",
                  heading: "获知战况\nUnderstand the Battle",
                  text:
                    "玩家需要快速知道本场战斗的基础结果。\nPlayers need to quickly know the basic result.\n\n包括：胜负情况、战斗类型、战损战获、战斗时间、战斗坐标、有无援军、战斗回放。\nIncludes result, battle type, losses, gains, time, coordinates, reinforcements, and replay."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "challenge",
                  heading: "判断胜负原因\nAnalyze the Reason",
                  text:
                    "进阶玩家需要进一步理解为什么赢或为什么输。\nAdvanced players need to know why they won or lost.\n\n包括：双方信息、战力差距、建筑状况、兵力情况、将领差距、技能情况。\nIncludes player info, power gap, building status, troop status, commander gap, and skills."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "direction",
                  heading: "设计判断\nDesign Decision",
                  text:
                    "战绩邮件需要同时服务两类用户：\nBattle mail needs to serve two user types:\n\n普通玩家\nCasual Players\n\n优先获得第一眼结论：胜负、奖励、损失、坐标、对手信息。\nThey need instant results: outcome, rewards, losses, coordinates, and opponent info.\n\n专家玩家\nAdvanced Players\n\n需要进一步展开详细数据：增益对比、兵种变化、战损率、回合信息。\nThey need detailed data: buff comparison, troop changes, loss rate, and round data."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "conclusion",
                  heading: "结论\nConclusion",
                  text:
                    "战绩邮件的设计重点，是先让玩家快速理解战斗结果，再为深度玩家提供可展开的复盘信息。\nThe key is to show the result first, then provide expandable data for deeper review."
                }
              ],
              body: ""
            },
            {
              label: "战绩邮件方案：分层展示复杂战斗数据",
              header: "03｜战绩邮件方案：分层展示复杂战斗数据\n03｜Battle Mail Solution: Layered Battle Data",
              title: "先展示结论，再展开数据：降低战报阅读成本\nShow the result first, then expand the data",
              subtitle: "",
              visual: "./assets/p2/loe/mail/mail_03.webp",
              introSections: [
                {
                  type: "text",
                  text:
                    "在战绩邮件方案中，我将信息展示拆分为「第一眼结论、双方对比、战损战获、增益情况、战斗详情」五个层级。\nI divided battle mail into five layers: result, comparison, losses/gains, buffs, and battle details.\n\n通过颜色、符号、方向箭头、左右对比和折叠展开，让玩家能够先快速理解结果，再按需查看更细的战斗数据。\nUsing color, symbols, arrows, side-by-side comparison, and expansion, players can read quickly or go deeper."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "solution",
                  heading: "01｜胜负情况前置\n01｜Result First",
                  text:
                    "在邮件预览和详情页中，将胜负结果作为第一眼信息展示。\nThe win/loss result appears first in both preview and detail pages.\n\n通过颜色、文字和符号强化胜负感知，让玩家不用进入详情就能快速判断战斗结果。\nColor, text, and symbols help players judge the result without opening details."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "solution",
                  heading: "02｜战斗类型与基础信息\n02｜Battle Type & Basic Info",
                  text:
                    "在核心信息下方展示战斗类型、玩家名称、工会简称、战力、战斗坐标等基础信息。\nBasic info includes battle type, player name, guild tag, power, and coordinates.\n\n帮助玩家快速判断「这场战斗是谁和谁、在哪里、发生了什么」。\nThis helps players understand who fought, where, and what happened."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "solution",
                  heading: "03｜战损战获区别设计\n03｜Different Design for Losses & Gains",
                  text:
                    "战获和战损采用不同的视觉策略：强调获得，弱化损失。\nGains and losses use different visual strategies: highlight gains, soften losses.\n\n对于玩家最关注的资源、死亡、治疗、剩余兵力等信息进行降序排列，并通过颜色增强死亡/救治的感知。\nKey data such as resources, deaths, healing, and remaining troops are sorted by importance and supported with color cues."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "solution",
                  heading: "04｜双方信息横向对比\n04｜Side-by-side Comparison",
                  text:
                    "双方玩家、兵力、战力、增益情况采用横向对比，帮助玩家快速理解差距来源。\nPlayers, troops, power, and buffs are compared horizontally to show where the gap comes from.\n\n箭头和阵营方向用于强调胜负关系和推进方向。\nArrows and side direction emphasize result and battle flow."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "solution",
                  heading: "05｜战斗详情折叠展开\n05｜Expandable Battle Details",
                  text:
                    "为专家玩家提供更细致的纵向数据。\nDetailed vertical data is provided for advanced players.\n\n通过折叠信息展示各回合数据，展开后显示兵种变化、伤害占比和战损率，方便玩家复盘并调整策略。\nExpandable sections show round data, troop changes, damage ratio, and loss rate for strategy review."
                },
                { type: "divider" },
                {
                  type: "section",
                  icon: "conclusion",
                  heading: "结论\nConclusion",
                  text:
                    "战绩邮件不只是战斗结果通知，而是一个兼顾快速判断与深度复盘的数据展示系统。\nBattle mail is not just a result notice; it is a data system for quick judgment and deep review."
                }
              ],
              body: ""
            }
          ]
        }
      ]
    },
    {
      year: "2024",
      title: "暗黑破坏神·不朽 / Diablo Immortal",
      subtitle: "Diablo Immortal",
      intro: "延续哥特幻想与暗金质感，完成作品详情入口视觉。",
      caseStudy: "以暗黑幻想氛围为主轴，控制黑色底板、古金色文字和项目图之间的视觉关系。",
      role: "Game Campaign Visual / Portfolio UI",
      tools: "Photoshop / Figma / JavaScript",
      outcome: "完成可点击、可弹窗、可横向滚动的作品集节点验证。",
      visual: "./assets/p2/anhei/anhei_01.webp",
      collapsibleSections: true,
      pages: [
        {
          label: "暗黑不朽：移动端 MMOARPG 早期 UX 支持",
          header: "01｜早期项目：复杂游戏界面的移动端交互支持\n01｜Early Project: Mobile UX Support for Complex Game Interfaces",
          title: "参与移动端 MMOARPG 的界面优化、功能补充与适配支持\nSupport UI optimization, feature design, and mobile adaptation for an MMOARPG",
          subtitle: "节选早期项目内容，部分信息因保密要求已做处理。\nSelected from an early-stage project; some details are adjusted for confidentiality.",
          visual: "./assets/p2/anhei/anhei_01.webp",
          body: "《暗黑破坏神：不朽》是暴雪娱乐与网易游戏联合开发的移动端 MMOARPG 项目。项目需要在保留暗黑系列视觉与交互气质的基础上，适配移动端操作、功能入口、状态反馈与多设备显示环境。\n\nDiablo Immortal is a mobile MMOARPG co-developed by Blizzard Entertainment and NetEase Games. The project required mobile-friendly interaction, feature entry points, state feedback, and device adaptation while preserving the original Diablo-style experience.\n\n在该项目中，我参与了多个早期 UX 支持任务，包括历史角色功能、特殊技能反馈、冒险者悬赏优化、信号栏状态设计、手机异形屏适配，以及部分暴雪文档整理与沟通支持。\n\nIn this project, I supported several early UX tasks, including previous-role recovery, special skill feedback, reward progress optimization, signal status display, mobile screen adaptation, and Blizzard document translation support.\n\n项目重点\nProject Focus\n\n这个项目的重点不是单一页面设计，而是在已有复杂游戏界面中补充功能、整理流程、控制信息层级，并保证新增内容不破坏原有游戏体验。\n\nThe focus was not one single screen, but adding features into an existing complex game interface, clarifying flows, controlling information hierarchy, and keeping the original game experience consistent."
        },
        {
          label: "关键功能设计：状态、流程与误操作控制",
          header: "02｜功能设计：从需求整理到状态反馈\n02｜Feature Design: From Requirements to State Feedback",
          title: "在复杂游戏系统中补充清晰、可执行的交互流程\nBuild clear and executable interaction flows within a complex game system",
          subtitle: "节选早期项目内容，部分信息因保密要求已做处理。\nSelected from an early-stage project; some details are adjusted for confidentiality.",
          visual: "./assets/p2/anhei/anhei_02.webp",
          body: "在历史角色、特殊技能与冒险者悬赏等功能中，我主要负责将策划需求拆解为可落地的交互流程，并补充不同角色、不同状态与不同结果下的界面反馈。\n\nFor features such as previous roles, special skills, and reward progress, I translated design requirements into executable interaction flows and defined interface feedback for different roles, states, and outcomes.\n\n设计拆解\nDesign Breakdown\n\n01｜历史角色：删除与恢复流程\n01｜Previous Roles: Delete & Restore Flow\n\n针对角色删除和恢复场景，我区分了 30 级以下与 30 级以上角色的不同处理方式，并设计删除确认、输入验证、错误提示、恢复确认与冷却提示，降低误操作风险。\n\nFor character deletion and recovery, I separated flows for roles under and above level 30, including confirmation dialogs, input verification, error messages, recovery confirmation, and cooldown reminders to reduce accidental actions.\n\n02｜特殊技能：首领与队员的差异反馈\n02｜Special Skill: Leader & Member Feedback\n\n特殊技能涉及发动者与被召唤者两类玩家。我分别整理首领端的技能释放、范围提示、冷却状态，以及队员端的传送入口、传送成功、失败、忽略和技能结束反馈。\n\nThe special skill involved two player roles: the leader who activates the skill and the team members who respond to it. I defined separate feedback for activation, range, cooldown, teleport entry, success, failure, ignore, and skill end states.\n\n03｜冒险者悬赏：奖励进度优化\n03｜Adventurer's Chronicle: Reward Progress Optimization\n\n在冒险者悬赏界面中，我参与优化日奖励进度条与刷新按钮位置，并根据小屏幕、多语言环境和界面层高问题调整方案，减少信息占位和阅读负担。\n\nFor the reward interface, I optimized the daily reward progress bar and refresh button placement, considering small screens, multilingual layouts, and vertical space limitations to reduce visual burden.\n\n结论\n\n这些功能设计的核心价值，是在复杂游戏系统中明确流程、状态和反馈，让新增功能可以被玩家理解，也可以被研发准确实现。\n\nThe value of these feature designs was to clarify flows, states, and feedback in a complex game system, making new features understandable for players and executable for development."
        },
        {
          label: "移动端适配与设计沉淀",
          header: "03｜适配与沉淀：移动端状态显示与设备环境\n03｜Adaptation & Learnings: Mobile Status Display and Device Context",
          title: "在移动端场景中平衡信息可见性、操作舒适区与画面干扰\nBalance visibility, comfort zones, and screen disturbance in mobile gameplay",
          subtitle: "节选早期项目内容，部分信息因保密要求已做处理。\nSelected from an early-stage project; some details are adjusted for confidentiality.",
          visual: "./assets/p2/anhei/anhei_03.webp",
          body: "移动端 MMOARPG 需要在有限屏幕内同时承载战斗画面、状态信息、操作按钮和系统反馈。因此，我参与了信号栏状态、手机异形屏适配和文档整理等支持工作，重点关注信息是否清晰、位置是否合理，以及是否会干扰核心游戏画面。\n\nMobile MMOARPG interfaces need to support combat visuals, status information, controls, and system feedback within limited screen space. I supported signal bar design, device adaptation, and documentation, focusing on visibility, placement, and reducing disturbance to gameplay.\n\n设计拆解\nDesign Breakdown\n\n01｜信号栏状态设计\n01｜Signal Bar State Design\n\n针对 Wi-Fi、移动信号、电量、弱信号、无信号和充电状态，我整理不同状态的显示方式，并比较左上、右上、右下等位置对画面遮挡和阅读习惯的影响。\n\nFor Wi-Fi, mobile signal, battery, weak signal, no signal, and charging states, I defined display variations and compared placements such as top-left, top-right, and bottom-right based on visual disturbance and reading habits.\n\n02｜手机异形屏适配\n02｜Device Screen Adaptation\n\n针对刘海屏、全面屏、折叠屏、水滴屏、穿孔屏和屏下摄像头等设备趋势，我整理移动端适配注意点，避免控件盲目贴边或依赖黑边处理，并考虑拇指操作舒适区与最小控件尺寸。\n\nFor notch screens, full-screen displays, foldable screens, waterdrop screens, punch-hole screens, and under-display cameras, I summarized adaptation considerations, avoiding edge-hugging layouts or black-border solutions while considering thumb zones and minimum touch sizes.\n\n03｜文档整理与跨团队沟通\n03｜Documentation & Cross-team Communication\n\n在整理暴雪相关文档的过程中，我学习了游戏英语表达、文档翻译的准确性与沟通礼貌，并尝试理解文档背后的设计目的，而不是只做字面翻译。\n\nWhile organizing Blizzard-related documents, I learned game-specific English vocabulary, translation accuracy, and communication etiquette, while trying to understand the design intent behind the documents instead of translating them literally.\n\n结论\n\n这个早期项目帮助我建立了对复杂游戏界面的基础认知：移动端设计不仅是放置控件，更需要同时考虑信息层级、状态可见性、误操作防护、设备差异和跨团队沟通。\n\nThis early project helped me build a foundation for complex game interface design: mobile UX is not only about placing controls, but also about information hierarchy, state visibility, error prevention, device differences, and cross-team collaboration."
        }
      ]
    },
    {
      year: "2026",
      title: "AI交互理念",
      subtitle: "New UX concept",
      intro: "对 AI 交互新范式理解：涌动式交互。",
      caseStudy: "从单线同步到多线并行，观察 AI 产品如何从工具辅助走向持续运行的协作系统。",
      role: "UX Concept / Product Thinking / AI Interaction Research",
      tools: "Product Research / UX Writing / Systems Thinking",
      outcome: "形成关于 AI 交互新范式的概念表达与产品观察框架。",
      visual: "./assets/p2/concept/con_01.webp",
      pages: [
        {
          label: "概念提出：AI 交互的下一步是涌动式交互",
          header: "01｜AI 交互观察：从单线同步到多线并行\n01｜AI Interaction Insight: From Single-line Sync to Multi-line Collaboration",
          title: "AI 交互未来是？我的答案是：涌动式交互\nWhat is the future of AI interaction? My answer: Flowing Interaction",
          subtitle: "本文原始版本首发于小红书，2025 年 10 月 22 日。\nThe original version of this article was first published on Xiaohongshu on October 22, 2025.",
          visual: "./assets/p2/concept/con_01.webp",
          collapsibleSections: true,
          body: "正文\n\nAI 交互的下一步，不是把每个产品都做成聊天框，也不是让 UI 更炫。\nThe next step of AI interaction is not turning every product into a chat box, nor making the UI flashier.\n\n我认为真正的变化在于：人机协作会从“单线同步”，走向“多线并行”。\nThe real shift is from single-line interaction to multi-line collaboration.\n\n过去的交互大多是：人点一下，系统回一下。\nIn the past, most interactions followed one loop: the user acts, the system responds.\n\n人不操作，系统就不动；人不输入，系统就不感知；人不发起任务，系统就不会继续推进。\nIf the user does nothing, the system does nothing.\n\n但 AI 产品正在让另一种可能变得清晰：系统和人可以同时工作。\nBut AI products are showing a new possibility: humans and systems can work at the same time.\n\n人可以在表达、判断、设定边界；AI 可以在后台感知、计划、执行、复盘，并把结果回流到任务、文档、代码、报表或资产库。\nHumans express intent and make decisions; AI senses, plans, executes, reviews, and writes results back into work systems.\n\n项目核心\nCore Concept\n\n我把这种未来的人机协作方式，暂时称为“涌动式交互”。\nI call this future collaboration pattern “Flowing Interaction.”\n\n它不是一条直线，而是很多条线一起流动：人线负责表达意图、判断方向和最终复核；AI 线负责持续感知、任务推进、异常预警和结果回流。\nIt is not one linear path, but multiple flows working together: the human line defines intent and judgment, while the AI line senses, executes, alerts, and returns results.\n\n设计拆解\nDesign Breakdown\n\n01｜打破单线同步\n01｜Break Single-line Sync\n\n传统交互依赖“用户操作 → 系统反馈”的同步循环。\nTraditional interaction depends on a user-action and system-response loop.\n\n但未来的 AI 系统不应该永远等待用户推动，而应该在用户暂时离开时继续整理信息、发现问题和推进任务。\nFuture AI systems should not only wait for users, but continue organizing, detecting, and progressing in the background.\n\n02｜判断真 AI 交互\n02｜Define Real AI Interaction\n\n我会用四个问题判断一个产品是否更接近真正的 AI 交互：是否自主推进、是否做出决策、是否会学习、是否形成闭环。\nI use four questions to judge real AI interaction: autonomy, decision-making, learning, and closed-loop output.\n\n如果一个产品只是多了聊天框、AI 按钮或炫酷 UI，但不能持续工作、主动推进和写回结果，它仍然只是 AI 外观。\nIf a product only adds a chat box or AI button without continuous work and result return, it is still only an AI-looking interface.\n\n03｜人线 H-Line\n03｜Human Line\n\n人线负责表达意图、设定边界、做关键判断和最终复核。\nThe human line handles intent, boundaries, key decisions, and final review.\n\n它可以是口语、对话、草图、截图、拖拽、批注、选择、确认或拒绝。\nIt can be speech, chat, sketching, screenshots, dragging, comments, choices, confirmation, or rejection.\n\n04｜AI 线 A-Line\n04｜AI Line\n\nAI 线不应该只在用户点击后出现，而应该持续存在。\nThe AI line should not appear only after a click; it should keep running.\n\n它可以读取文档、会议、代码、数据和任务状态，拆解任务、调用工具、修改文件、补全数据，并在发现风险时主动回流给人。\nIt can read documents, meetings, code, data, and tasks, then break down work, call tools, update files, complete data, and report risks.\n\n05｜涌动式交互\n05｜Flowing Interaction\n\n同步协同是“你点我回”。\nSynchronous interaction is: you click, I respond.\n\n涌动式交互是“你不点我，我也在主动前进、回看、预判、补救、总结”。\nFlowing interaction is: even when you do not click, I keep moving, reviewing, predicting, repairing, and summarizing.\n\n结论\nConclusion\n\n涌动式交互不是一个更漂亮的 UI 形态，而是一种新的协作结构。\nFlowing interaction is not a prettier UI style, but a new collaboration structure.\n\n核心表达\nKey Sentence\n\nAI 交互的未来，不是让所有产品都长得更像 ChatGPT，而是让产品从“等待用户点击”，变成“能够自己前进”。\nThe future of AI interaction is not making every product look like ChatGPT, but making products able to move forward on their own."
        },
        {
          label: "产品观察：涌动式交互的早期雏形",
          header: "02｜AI 产品观察：从工具辅助到协作系统\n02｜AI Product Observation: From Tool Assistance to Collaboration Systems",
          title: "哪些产品已经出现涌动式交互的雏形？\nWhich products are showing early signs of flowing interaction?",
          subtitle: "",
          visual: "./assets/p2/concept/con_02.webp",
          collapsibleSections: true,
          body: "正文\n\n截至 2026 年 6 月，还没有哪个产品真正完整实现了我所说的“涌动式交互”。\nAs of June 2026, no product has fully realized what I call “Flowing Interaction.”\n\n但如果拆开来看，很多产品已经在不同方向上出现了雏形：有的靠近持续感知，有的靠近自主推进，有的靠近结果回流，有的开始承担跨工具中枢的角色。\nBut many products already show early signals: continuous sensing, autonomous progress, result return, and cross-tool coordination.\n\n它们还不是终态，但已经能看到未来交互结构的影子。\nThey are not the final form, but they reveal the structure of future interaction.\n\n项目核心\nCore Focus\n\n2026 年的 AI 产品变化说明：AI 正在从“回答问题”，走向“推进过程”。\nAI products in 2026 show a shift from answering questions to moving processes forward.\n\n真正重要的不是 AI 生成了什么，而是它是否能读懂上下文、拆解任务、调用工具、持续推进，并把结果写回原来的业务系统。\nThe key is not what AI generates, but whether it can understand context, break down tasks, call tools, keep working, and write results back.\n\n设计拆解\nDesign Breakdown\n\n01｜研发协作层：从代码助手到工程代理\n01｜Development: From Coding Assistant to Engineering Agent\n\n研发场景最早出现明显变化。\nDevelopment tools are showing the clearest shift.\n\nCursor、GitHub Copilot cloud agent、OpenAI Codex、Claude Code 等产品，已经不只是补全代码，而是开始读取代码库、理解上下文、制定计划、修改文件、运行命令、创建 PR 或辅助 review。\nTools like Cursor, GitHub Copilot cloud agent, OpenAI Codex, and Claude Code are moving from code completion to repo understanding, planning, file editing, command running, PR creation, and review support.\n\n这意味着研发协作正在从“人写代码，AI 辅助补全”，转向“人定义目标，AI 在工程环境里持续推进一部分工作”。\nThis means development is shifting from “humans write code, AI assists” to “humans set goals, AI advances work inside the engineering environment.”\n\n02｜会议与知识层：从会议记录到知识节点\n02｜Meetings & Knowledge: From Notes to Knowledge Nodes\n\n会议产品也在从记录工具变成知识协作节点。\nMeeting tools are also becoming knowledge collaboration nodes.\n\nGranola、Otter、Notion Custom Agents 等产品，让 AI 可以在会议中持续记录、提炼重点、整理行动项，并把结果带回知识库、任务或业务系统。\nProducts like Granola, Otter, and Notion Custom Agents let AI record, summarize, extract action items, and return results to knowledge bases, tasks, or work systems.\n\n会议不再只是一次性对话，而是可以被复盘、追踪、调用和继续推进的知识资产。\nMeetings become reusable knowledge assets that can be reviewed, tracked, retrieved, and continued.\n\n03｜业务自动化层：从固定流程到 AI 中枢\n03｜Automation: From Fixed Workflow to AI Hub\n\nZapier、Make、n8n、Lindy 等产品正在接近自动化中枢的雏形。\nTools like Zapier, Make, n8n, and Lindy are becoming early forms of AI hubs.\n\n它们的核心不是生成内容，而是连接动作：监听事件、读取上下文、调用工具、搬运数据、同步结果。\nTheir core is not content generation, but action connection: listening, reading context, calling tools, moving data, and syncing results.\n\n当自动化平台和模型、业务数据、权限系统结合后，它会逐渐从“自动化胶水”演化成真正的 AI 中枢。\nWhen automation platforms connect models, business data, and permissions, they may evolve from automation glue into real AI hubs.\n\n04｜研究与执行层：从回答问题到完成任务\n04｜Research & Execution: From Answering to Task Completion\n\nAI 正在从“给答案”走向“完成一个过程”。\nAI is moving from giving answers to completing processes.\n\nDeep Research、ChatGPT agent、Gemini Enterprise Agent Platform、NotebookLM 等产品，已经开始体现多步骤研究、资料理解、任务推进和跨工具执行能力。\nProducts such as Deep Research, ChatGPT agent, Gemini Enterprise Agent Platform, and NotebookLM show abilities in multi-step research, material understanding, task execution, and cross-tool workflows.\n\n用户提出目标后，AI 可以自行检索、判断、组织、生成、调用工具，再把结果交还给用户确认。\nAfter users set a goal, AI can search, judge, organize, generate, call tools, and return results for review.\n\n05｜设计与创作层：从生成画面到跨工具创作流程\n05｜Design & Creation: From Image Generation to Creative Workflow\n\n设计工具也不再只是画布。\nDesign tools are no longer just canvases.\n\nFigma Make、Google Stitch、Adobe Firefly AI Assistant 等产品，已经开始支持从自然语言、图片或线框图生成 UI、原型、代码或多步骤创作流程。\nFigma Make, Google Stitch, and Adobe Firefly AI Assistant can generate UI, prototypes, code, or creative workflows from prompts, images, or wireframes.\n\n不过，这类产品目前更偏向生成和辅助执行，还没有完全形成持续理解目标、自动追踪反馈、主动调整策略和稳定回流结果的完整闭环。\nHowever, they are still closer to generation and assisted execution, not yet full closed-loop collaboration systems.\n\n结论\nConclusion\n\n真正的分界线，不是产品有没有 AI 按钮，也不是界面是否足够炫。\nThe real boundary is not whether a product has an AI button or a flashy interface.\n\n关键在于：它是否能持续感知上下文、自主推进任务、根据反馈调整策略，并把结果写回业务系统。\nThe key is whether it can continuously sense context, advance tasks, learn from feedback, and write results back into work systems.\n\n核心表达\nKey Sentence\n\n未来真正有价值的 AI 产品，不会只是一个聪明的输入框，而会更像一个持续运行的协作系统。\nFuture AI products will not be smart input boxes, but continuously running collaboration systems.\n\n人在前面定方向，AI 在背后推动水流。\nHumans set the direction; AI keeps the flow moving behind the scenes."
        }
      ]
    }
  ];

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function measure() {
    var stickyWidth = selectedViewport ? selectedViewport.clientWidth : sticky.clientWidth;
    var trackWidth = track.scrollWidth;
    var leftOffset = parseFloat(window.getComputedStyle(track).left) || 0;
    maxTranslate = Math.max(0, trackWidth - stickyWidth + leftOffset + 80);

    if (isEmbedMode) {
      applyEmbedTimelineState();
      return;
    }

    updateTimeline();
  }

  function getProgress() {
    var rect = scene.getBoundingClientRect();
    var scrollableDistance = scene.offsetHeight - window.innerHeight;

    if (scrollableDistance <= 0) {
      return 0;
    }

    return clamp(-rect.top / scrollableDistance, 0, 1);
  }

  function updateTimeline() {
    rafId = null;

    if (isEmbedMode) {
      applyEmbedTimelineState();
      return;
    }

    var progress = getProgress();
    var x = -maxTranslate * progress;
    var activeIndex = Math.round(progress * (nodeItems.length - 1));

    track.style.transform = "translate3d(" + x.toFixed(2) + "px, 0, 0)";
    setActiveNode(activeIndex);
  }

  function setActiveNode(activeIndex) {
    nodeItems.forEach(function (node, index) {
      node.classList.toggle("is-active", index === activeIndex);
    });
  }

  function applyEmbedTimelineState() {
    track.style.transform = "translate3d(0, 0, 0)";
    setActiveNode(0);
  }

  function requestTick() {
    if (rafId === null) {
      rafId = window.requestAnimationFrame(updateTimeline);
    }
  }

  function padPageNumber(index) {
    return String(index + 1).padStart(2, "0");
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatIntroText(text) {
    return escapeHtml(text).replace(/\n/g, "<br>");
  }

  function splitBilingualLine(text) {
    var lines = String(text || "").split("\n").map(function (line) {
      return line.trim();
    }).filter(Boolean);

    return {
      cn: lines[0] || "",
      en: lines.slice(1).join(" ")
    };
  }

  function splitInfoValue(line) {
    var index = String(line || "").indexOf("：");

    if (index < 0) {
      index = String(line || "").indexOf(":");
    }

    if (index < 0) {
      return null;
    }

    return {
      label: String(line).slice(0, index).trim(),
      value: String(line).slice(index + 1).trim()
    };
  }

  function splitChips(value) {
    return String(value || "")
      .split(/[\/、，,]/)
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function parseProjectInfo(text) {
    var lines = String(text || "").split("\n").map(function (line) {
      return line.trim();
    }).filter(Boolean);
    var items = [];

    for (var index = 0; index < lines.length; index += 1) {
      var cn = splitInfoValue(lines[index]);

      if (!cn) {
        continue;
      }

      var en = index + 1 < lines.length ? splitInfoValue(lines[index + 1]) : null;
      var isScope = cn.label === "项目范围" || (en && en.label === "Scope");

      items.push({
        labelCn: cn.label,
        labelEn: en ? en.label : "",
        cn: cn.value,
        en: en ? en.value : "",
        isScope: isScope,
        chipsCn: isScope ? splitChips(cn.value) : [],
        chipsEn: isScope && en ? splitChips(en.value) : []
      });

      if (en) {
        index += 1;
      }
    }

    return items;
  }

  function splitProjectInfoText(text) {
    var chunks = String(text || "").split(/\n{2,}/).map(function (chunk) {
      return chunk.trim();
    }).filter(Boolean);
    var infoChunks = [];
    var summaryChunks = [];
    var hasSummaryStarted = false;

    chunks.forEach(function (chunk) {
      var lines = chunk.split("\n").map(function (line) {
        return line.trim();
      }).filter(Boolean);
      var first = lines[0] || "";
      var second = lines[1] || "";
      var looksLikeInfo = !hasSummaryStarted && Boolean(splitInfoValue(first)) && Boolean(splitInfoValue(second));

      if (looksLikeInfo) {
        infoChunks.push(chunk);
        return;
      }

      hasSummaryStarted = true;
      summaryChunks.push(chunk);
    });

    return {
      info: infoChunks.join("\n\n"),
      summary: summaryChunks.join("\n\n")
    };
  }

  function renderSummaryCard(text) {
    if (!String(text || "").trim()) {
      return "";
    }

    return (
      '<section class="pt-summary-card">' +
      '<div class="pt-summary-head">' +
      '<span class="pt-summary-star" aria-hidden="true">☆</span>' +
      '<span class="pt-summary-title"><span>项目摘要</span><small>Project Summary</small></span>' +
      "</div>" +
      '<div class="pt-summary-body">' + formatIntroText(text) + "</div>" +
      "</section>"
    );
  }

  function renderInfoChips(item) {
    var count = Math.max(item.chipsCn.length, item.chipsEn.length);
    var html = "";

    for (var index = 0; index < count; index += 1) {
      html += (
        '<span class="pt-info-chip">' +
        '<span class="pt-chip-cn">' + escapeHtml(item.chipsCn[index] || "") + "</span>" +
        '<span class="pt-chip-en">' + escapeHtml(item.chipsEn[index] || "") + "</span>" +
        "</span>"
      );
    }

    return html;
  }

  function renderProjectInfo(text) {
    var items = parseProjectInfo(text);

    if (!items.length) {
      return "";
    }

    return (
      '<section class="pt-project-info">' +
      '<div class="pt-project-info-head">' +
      getIntroIcon("role") +
      '<div class="pt-intro-section-title">项目信息<br>Project Info</div>' +
      "</div>" +
      '<div class="pt-info-list">' +
      items.map(function (item) {
        var body = item.isScope
          ? '<div class="pt-info-chips">' + renderInfoChips(item) + "</div>"
          : (
            '<div class="pt-info-cn">' + escapeHtml(item.cn) + "</div>" +
            '<div class="pt-info-en">' + escapeHtml(item.en) + "</div>"
          );

        return (
          '<div class="pt-info-row' + (item.isScope ? " is-scope" : "") + '">' +
          '<div class="pt-info-label">' +
          '<span>' + escapeHtml(item.labelCn) + "</span>" +
          '<small>' + escapeHtml(item.labelEn) + "</small>" +
          "</div>" +
          '<div class="pt-info-value">' + body + "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  function parseNumberedModules(text) {
    var source = String(text || "").trim();

    if (!source || !/(^|\n)\d{2}(?:\s|｜|：|:)/.test(source)) {
      return null;
    }

    var modules = [];
    var current = null;

    source.split("\n").forEach(function (line) {
      var cleanLine = line.trim();
      var headingMatch = cleanLine.match(/^(\d{2})(?:\s|｜|：|:)/);

      if (!cleanLine) {
        return;
      }

      if (headingMatch) {
        var headingNumber = headingMatch[1];

        if (!current || current.number !== headingNumber) {
          if (current) {
            modules.push(current);
          }

          current = {
            number: headingNumber,
            headingLines: [cleanLine],
            bodyLines: []
          };
          return;
        }

        current.headingLines.push(cleanLine);
        return;
      }

      if (current) {
        current.bodyLines.push(cleanLine);
      }
    });

    if (current) {
      modules.push(current);
    }

    modules = modules.map(function (item) {
      return {
        heading: item.headingLines.join("\n"),
        text: item.bodyLines.join("\n\n").trim()
      };
    }).filter(function (item) {
      return item.heading;
    });

    return modules.length >= 2 ? modules : null;
  }

  function renderNumberedModules(text) {
    var modules = parseNumberedModules(text);

    if (!modules || !modules.length) {
      return '<div class="pt-intro-section-body">' + formatIntroText(text) + "</div>";
    }

    return (
      '<div class="pt-module-list">' +
      modules.map(function (item) {
        return (
          '<article class="pt-mini-module">' +
          '<div class="pt-mini-module-head">' + formatIntroText(item.heading) + "</div>" +
          '<div class="pt-mini-module-body">' + formatIntroText(item.text) + "</div>" +
          "</article>"
        );
      }).join("") +
      "</div>"
    );
  }

  function renderIntroSectionBody(block) {
    if (!block.text || !String(block.text).trim()) {
      return "";
    }

    if (block.type === "project-info") {
      return renderProjectInfo(block.text);
    }

    if (block.type === "summary" || block.type === "text") {
      return '<div class="pt-intro-section-body pt-intro-summary-body">' + formatIntroText(block.text) + "</div>";
    }

    return renderNumberedModules(block.text);
  }

  function normalizeIntroTabBlock(block) {
    if (block.type === "summary" || block.type === "text") {
      return {
        type: block.type,
        icon: "value",
        heading: "项目摘要\nProject Summary",
        text: block.text
      };
    }

    if (block.type === "project-info") {
      return {
        type: block.type,
        icon: "role",
        heading: "项目信息\nProject Info",
        text: block.text
      };
    }

    return block;
  }

  function renderIntroTabLabel(heading) {
    var parts = splitBilingualLine(heading);

    return (
      '<span class="pt-intro-tab-cn">' + escapeHtml(parts.cn) + "</span>" +
      (parts.en ? '<span class="pt-intro-tab-en">' + escapeHtml(parts.en) + "</span>" : "")
    );
  }

  function renderIntroTabs(blocks) {
    if (!blocks.length) {
      return "";
    }

    return (
      '<section class="pt-intro-tabs" data-pt-intro-tabs>' +
      '<div class="pt-intro-tablist" role="tablist" aria-label="详情章节">' +
      blocks.map(function (block, index) {
        return (
          '<button class="pt-intro-tab' + (index === 0 ? " is-active" : "") + '" type="button" role="tab" ' +
          'aria-selected="' + (index === 0 ? "true" : "false") + '" data-pt-intro-tab="' + index + '">' +
          getIntroIcon(block.icon) +
          '<span class="pt-intro-tab-text">' + renderIntroTabLabel(block.heading) + "</span>" +
          "</button>"
        );
      }).join("") +
      "</div>" +
      '<div class="pt-intro-tab-panels">' +
      blocks.map(function (block, index) {
        return (
          '<section class="pt-intro-tab-panel' + (index === 0 ? " is-active" : "") + '" data-pt-intro-panel="' + index + '"' +
          (index === 0 ? "" : " hidden") + ">" +
          '<div class="pt-intro-section-head">' +
          getIntroIcon(block.icon) +
          '<div class="pt-intro-section-title">' + formatIntroText(block.heading) + "</div>" +
          "</div>" +
          renderIntroSectionBody(block) +
          "</section>"
        );
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  var introSectionHeadingDefs = [
    { cn: "正文", en: "", icon: "direction", type: "summary" },
    { cn: "项目信息", en: "Project Info", icon: "role" },
    { cn: "项目核心", en: "Core Focus", icon: "value" },
    { cn: "项目重点", en: "Project Focus", icon: "value" },
    { cn: "项目状态", en: "", icon: "state" },
    { cn: "游戏简介", en: "", icon: "direction" },
    { cn: "核心玩法", en: "", icon: "guidelines" },
    { cn: "我的职责", en: "My Role", icon: "role" },
    { cn: "设计挑战", en: "Design Challenges", icon: "challenge" },
    { cn: "设计指针", en: "Design Guidelines", icon: "guidelines" },
    { cn: "设计方向", en: "Design Direction", icon: "direction" },
    { cn: "设计拆解", en: "Design Breakdown", icon: "guidelines" },
    { cn: "研究拆解", en: "Research Breakdown", icon: "guidelines" },
    { cn: "调研洞察", en: "Research Insights", icon: "challenge" },
    { cn: "设计策略", en: "Design Strategy", icon: "direction" },
    { cn: "关键方案", en: "Key Solutions", icon: "solution" },
    { cn: "核心功能", en: "Core Features", icon: "value" },
    { cn: "设计价值", en: "Design Value", icon: "value" },
    { cn: "结论", en: "Conclusion", icon: "conclusion" },
    { cn: "核心表达", en: "Key Sentence", icon: "value" },
    { cn: "Overview", en: "", icon: "direction" },
    { cn: "Core Gameplay", en: "", icon: "guidelines" },
    { cn: "Development Status", en: "", icon: "state" }
  ];

  function escapeRegExp(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function formatIntroSectionHeading(def) {
    return def.en ? def.cn + "\n" + def.en : def.cn;
  }

  function findIntroSectionMarker(body, def) {
    if (def.en) {
      var bilingualKey = def.cn + "\n" + def.en;
      var bilingualIdx = body.indexOf(bilingualKey);

      if (bilingualIdx >= 0) {
        return { idx: bilingualIdx, key: bilingualKey };
      }
    }

    var linePattern = new RegExp("(^|\\n)" + escapeRegExp(def.cn) + "(\\n|$)");
    var match = linePattern.exec(body);

    if (match) {
      return { idx: match.index + (match[1] === "\n" ? 1 : 0), key: def.cn };
    }

    return null;
  }

  function buildFallbackIntroSections(body) {
    var trimmed = String(body || "").trim();

    if (!trimmed) {
      return null;
    }

    if (trimmed.indexOf("\n") === -1) {
      return [
        {
          type: "section",
          icon: "direction",
          heading: trimmed,
          text: ""
        }
      ];
    }

    return [{ type: "text", text: trimmed }];
  }

  function getSectionHeadingCn(heading) {
    return splitBilingualLine(heading).cn;
  }

  function mergeCompanionIntroSections(blocks) {
    var sectionMap = {
      Overview: "游戏简介",
      "Core Gameplay": "核心玩法",
      "Development Status": "项目状态"
    };
    var targetBlocks = {};

    blocks.forEach(function (block) {
      if (block.type === "section") {
        targetBlocks[getSectionHeadingCn(block.heading)] = block;
      }
    });

    return blocks.reduce(function (items, block) {
      var headingCn = block.type === "section" ? getSectionHeadingCn(block.heading) : "";
      var targetHeading = sectionMap[headingCn];

      if (targetHeading && targetBlocks[targetHeading]) {
        var target = targetBlocks[targetHeading];
        target.text = [target.text, block.heading, block.text].filter(Boolean).join("\n\n");

        if (items[items.length - 1] && items[items.length - 1].type === "divider") {
          items.pop();
        }

        return items;
      }

      if (block.type === "divider" && (!items.length || items[items.length - 1].type === "divider")) {
        return items;
      }

      items.push(block);
      return items;
    }, []);
  }

  function buildIntroSectionsFromBody(body) {
    if (!body || !String(body).trim()) {
      return null;
    }

    var markers = [];

    introSectionHeadingDefs.forEach(function (def) {
      var found = findIntroSectionMarker(body, def);

      if (found) {
        markers.push({ idx: found.idx, key: found.key, def: def });
      }
    });

    if (!markers.length) {
      return buildFallbackIntroSections(body);
    }

    markers.sort(function (a, b) {
      return a.idx - b.idx;
    });

    markers = markers.filter(function (marker, index) {
      return index === 0 || marker.idx !== markers[index - 1].idx;
    });

    var blocks = [];
    var lead = body.slice(0, markers[0].idx).trim();

    if (lead) {
      blocks.push({ type: "summary", text: lead });
      blocks.push({ type: "divider" });
    }

    markers.forEach(function (marker, index) {
      var start = marker.idx + marker.key.length;
      var end = index + 1 < markers.length ? markers[index + 1].idx : body.length;
      var text = body.slice(start, end).replace(/^\n+/, "").trim();

      if (marker.def.type === "summary") {
        blocks.push({
          type: "summary",
          text: text
        });
      } else if (marker.def.cn === "项目信息") {
        var projectInfo = splitProjectInfoText(text);

        if (projectInfo.summary) {
          blocks.push({
            type: "summary",
            text: projectInfo.summary
          });
          blocks.push({ type: "divider" });
        }

        blocks.push({
          type: "project-info",
          text: projectInfo.info || text
        });
      } else {
      blocks.push({
        type: "section",
        icon: marker.def.icon,
        heading: formatIntroSectionHeading(marker.def),
        text: text
      });
      }

      if (index < markers.length - 1) {
        blocks.push({ type: "divider" });
      }
    });

    return mergeCompanionIntroSections(blocks);
  }

  function getIntroIcon(type) {
    if (type === "role") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<circle cx="10" cy="8.5" r="3.25" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<path d="M4.5 19.5c0-3 2.8-5.5 5.5-5.5s5.5 2.5 5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '<rect x="14.5" y="5.5" width="6.5" height="8.5" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<path d="M16.5 8.5h2.5M16.5 10.75h2.5M16.5 13h1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        "</svg>"
      );
    }

    if (type === "challenge") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<circle cx="5.5" cy="12" r="2.2" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<circle cx="18.5" cy="6.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<circle cx="18.5" cy="17.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<path d="M7.6 11.2 16.4 7.8M7.6 12.8l8.8 3.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        "</svg>"
      );
    }

    if (type === "guidelines") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="m12 8 2.5 4.5H9.5L12 8Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
        "</svg>"
      );
    }

    if (type === "direction") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<rect x="3.5" y="5" width="7" height="14" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<rect x="13.5" y="5" width="7" height="14" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<path d="M10.5 12h3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        "</svg>"
      );
    }

    if (type === "short-flow") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M7 7h8a3 3 0 0 1 0 6H9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M9 5 7 7l2 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>"
      );
    }

    if (type === "long-flow") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M5 6c3 0 4 2 4 4s-1 4-4 4M13 10c3 0 4 2 4 4s-1 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="M9 10h4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        "</svg>"
      );
    }

    if (type === "state") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M4 8h16v4H4V8Zm0 6h16v4H4v-4Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
        "</svg>"
      );
    }

    if (type === "state-types") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<rect x="4" y="5" width="7" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<rect x="13" y="5" width="7" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<rect x="4" y="14" width="7" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<rect x="13" y="14" width="7" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        "</svg>"
      );
    }

    if (type === "solution") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M9.5 18.5h5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="M10 18.5V16a2 2 0 0 1 2-2h0a2 2 0 0 0 2-2V9.5a3.5 3.5 0 1 0-7 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>"
      );
    }

    if (type === "value") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M12 4.5 14.8 10l6.2.9-4.5 4.4 1.1 6.2L12 18.8 6.4 21.5l1.1-6.2L3 10.9l6.2-.9L12 4.5Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
        "</svg>"
      );
    }

    if (type === "axis-x") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M4 12h16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="M6 10 4 12l2 2M18 10l2 2-2 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>"
      );
    }

    if (type === "axis-y") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M12 4v16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="M10 6 12 4l2 2M10 18l2 2 2-2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>"
      );
    }

    if (type === "axis-z") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M5 9.5 12 5.5l7 4v9l-7 4-7-4v-9Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<path d="M12 13.5V21.5M5 9.5 12 13.5l7-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
        "</svg>"
      );
    }

    if (type === "conclusion") {
      return (
        '<svg class="pt-intro-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<path d="M8.2 12.2 10.8 14.8 16 9.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>"
      );
    }

    return "";
  }

  function renderModalIntro(page) {
    if (!modalIntro) {
      return;
    }

    var introSections = page.introSections && page.introSections.length
      ? page.introSections
      : buildIntroSectionsFromBody(page.body);
    var useCollapse = Boolean(page.collapsibleSections);

    if (!introSections || !introSections.length) {
      modalIntro.textContent = page.body || "";
      return;
    }

    if (useCollapse) {
      var tabBlocks = [];

      introSections.forEach(function (block) {
        if (block.type === "divider") {
          return;
        }

        tabBlocks.push(normalizeIntroTabBlock(block));
      });

      modalIntro.innerHTML = renderIntroTabs(tabBlocks);
      return;
    }

    modalIntro.innerHTML = introSections
      .map(function (block) {
        if (block.type === "text") {
          return '<div class="pt-intro-block">' + formatIntroText(block.text) + "</div>";
        }

        if (block.type === "divider") {
          return '<div class="pt-intro-divider" role="presentation"></div>';
        }

        if (block.type === "summary") {
          return renderSummaryCard(block.text);
        }

        if (block.type === "project-info") {
          return renderProjectInfo(block.text);
        }

        if (block.type === "section") {
          var sectionBody = renderIntroSectionBody(block);

          return (
            '<section class="pt-intro-section">' +
            '<div class="pt-intro-section-head">' +
            getIntroIcon(block.icon) +
            '<div class="pt-intro-section-title">' +
            formatIntroText(block.heading) +
            "</div>" +
            "</div>" +
            sectionBody +
            "</section>"
          );
        }

        return "";
      })
      .join("");
  }

  function renderModalTitle(title) {
    if (!modalTitle) {
      return;
    }

    var parts = splitBilingualLine(title || "");

    if (!parts.en) {
      modalTitle.textContent = parts.cn;
      return;
    }

    modalTitle.innerHTML =
      '<span class="pt-title-cn">' + escapeHtml(parts.cn) + "</span>" +
      '<span class="pt-title-en">' + escapeHtml(parts.en) + "</span>";
  }

  function normalizePages(rawPages, project) {
    return rawPages.map(function (page, index) {
      if (typeof page === "string") {
        return {
          label: index === 0 ? "项目概览" : "章节内容",
          title: project.title,
          subtitle: project.subtitle,
          visual: project.visual,
          videoEmbed: project.videoEmbed,
          collapsibleSections: true,
          body: page
        };
      }

      return {
        label: page.label || (index === 0 ? "项目概览" : "章节内容"),
        header: page.header,
        title: page.title || project.title,
        subtitle: page.subtitle || project.subtitle,
        visual: page.visual || project.visual,
        videoEmbed: page.videoEmbed || project.videoEmbed,
        pdfEmbed: page.pdfEmbed || project.pdfEmbed,
        pdfRev: page.pdfRev || project.pdfRev,
        collapsibleSections: page.collapsibleSections === false
          ? false
          : true,
        body: page.body || "",
        introSections: page.introSections || null
      };
    });
  }

  function resolveSectionPages(section, project) {
    var rawPages = section.pages || [];

    if (!rawPages.length && section.reuseFrom !== undefined && project.sections) {
      var sourceSection = project.sections[section.reuseFrom];

      if (sourceSection && sourceSection.pages) {
        rawPages = sourceSection.pages.slice(0, section.reuseCount || 3);
      }
    }

    var pages = normalizePages(rawPages, project);

    if (typeof section.pageLimit === "number") {
      return pages.slice(0, Math.max(0, section.pageLimit));
    }

    return pages;
  }

  function getProjectPages(project, sectionIndex) {
    if (project.sections) {
      var index = typeof sectionIndex === "number" ? sectionIndex : 0;
      var section = project.sections[index];

      if (!section) {
        return [];
      }

      return resolveSectionPages(section, project);
    }

    if (project.pages) {
      return normalizePages(project.pages, project);
    }

    return [
      {
        label: "项目概览",
        title: project.title,
        subtitle: project.subtitle,
        visual: project.visual,
        videoEmbed: project.videoEmbed,
        body: project.intro || "项目内容整理中。"
      },
      {
        label: "正文",
        title: project.title,
        subtitle: project.subtitle,
        visual: project.visual,
        videoEmbed: project.videoEmbed,
        body: [
          project.caseStudy || "该项目的详细正文内容将在后续版本中补充。",
          "我的职责\n" + (project.role || "负责项目视觉方向、页面结构与交互展示。"),
          "Tools\n" + (project.tools || "Figma / Photoshop"),
          "Outcome\n" + (project.outcome || "形成可用于作品集展示的项目页面。")
        ].join("\n\n")
      },
      {
        label: "项目沉淀",
        title: project.title,
        subtitle: project.subtitle,
        visual: project.visual,
        videoEmbed: project.videoEmbed,
        body: [
          "设计沉淀\n该页用于补充项目过程、视觉原则与后续成果说明。",
          "Design Notes\nThis page provides additional notes on process, visual principles, and project outcomes.",
          "后续可在这里替换为更具体的项目截图、流程拆解或案例总结。"
        ].join("\n\n")
      }
    ];
  }

  function getSectionTabIcon(type, isActive) {
    if (type === "product-design") {
      if (isActive) {
        return (
          '<svg class="pt-section-tab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
          '<rect x="4.5" y="5.5" width="15" height="13" rx="1.2" fill="currentColor"/>' +
          '<path d="M8 9.5h8M8 12h5.5M8 14.5h6.5" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="1.1" stroke-linecap="round"/>' +
          "</svg>"
        );
      }

      return (
        '<svg class="pt-section-tab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<rect x="4.5" y="5.5" width="15" height="13" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.35"/>' +
        '<path d="M8 9.5h8M8 12h5.5M8 14.5h6.5" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>' +
        "</svg>"
      );
    }

    if (type === "design-review") {
      if (isActive) {
        return (
          '<svg class="pt-section-tab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
          '<circle cx="10.5" cy="10.5" r="5.25" fill="currentColor"/>' +
          '<path d="m14.6 14.6 4.4 4.4" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="1.35" stroke-linecap="round"/>' +
          '<path d="M8.7 10.2 10 11.5l2.8-2.6" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>' +
          "</svg>"
        );
      }

      return (
        '<svg class="pt-section-tab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<circle cx="10.5" cy="10.5" r="5.25" fill="none" stroke="currentColor" stroke-width="1.35"/>' +
        '<path d="m14.6 14.6 4.4 4.4" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>' +
        '<path d="M8.7 10.2 10 11.5l2.8-2.6" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>"
      );
    }

    if (type === "user-research") {
      if (isActive) {
        return (
          '<svg class="pt-section-tab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
          '<circle cx="9.5" cy="8.75" r="2.75" fill="currentColor"/>' +
          '<path d="M5.25 17.25c.65-2.45 2.35-3.75 4.25-3.75s3.6 1.3 4.25 3.75" fill="currentColor"/>' +
          '<circle cx="16.25" cy="9.25" r="2" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="1.1"/>' +
          '<path d="M13.75 16.75c.45-1.55 1.45-2.35 2.5-2.35s2.05.8 2.5 2.35" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="1.1" stroke-linecap="round"/>' +
          "</svg>"
        );
      }

      return (
        '<svg class="pt-section-tab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<circle cx="9.5" cy="8.75" r="2.75" fill="none" stroke="currentColor" stroke-width="1.35"/>' +
        '<path d="M5.25 17.25c.65-2.45 2.35-3.75 4.25-3.75s3.6 1.3 4.25 3.75" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>' +
        '<circle cx="16.25" cy="9.25" r="2" fill="none" stroke="currentColor" stroke-width="1.35"/>' +
        '<path d="M13.75 16.75c.45-1.55 1.45-2.35 2.5-2.35s2.05.8 2.5 2.35" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>' +
        "</svg>"
      );
    }

    if (type === "product-guidelines") {
      if (isActive) {
        return (
          '<svg class="pt-section-tab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
          '<path d="M6.5 4.75h8.35l3.35 3.35V18.5a1.25 1.25 0 0 1-1.25 1.25H6.5a1.25 1.25 0 0 1-1.25-1.25V6a1.25 1.25 0 0 1 1.25-1.25Z" fill="currentColor"/>' +
          '<path d="M14.85 4.75V8.1h3.35M8.25 11.5h7.5M8.25 14.25h7.5M8.25 17h5" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="1.1" stroke-linecap="round"/>' +
          "</svg>"
        );
      }

      return (
        '<svg class="pt-section-tab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M6.5 4.75h8.35l3.35 3.35V18.5a1.25 1.25 0 0 1-1.25 1.25H6.5a1.25 1.25 0 0 1-1.25-1.25V6a1.25 1.25 0 0 1 1.25-1.25Z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>' +
        '<path d="M14.85 4.75V8.1h3.35M8.25 11.5h7.5M8.25 14.25h7.5M8.25 17h5" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>' +
        "</svg>"
      );
    }

    if (type === "mail") {
      if (isActive) {
        return (
          '<svg class="pt-section-tab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
          '<path d="M3.25 7.25 12 13.75 20.75 7.25V17a1.25 1.25 0 0 1-1.25 1.25H4.5A1.25 1.25 0 0 1 3.25 17V7.25Z" fill="currentColor"/>' +
          '<path d="M3.25 7.25 12 13.75 20.75 7.25" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="1.1" stroke-linejoin="round"/>' +
          "</svg>"
        );
      }

      return (
        '<svg class="pt-section-tab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<rect x="3.25" y="6.75" width="17.5" height="11.5" rx="1.1" fill="none" stroke="currentColor" stroke-width="1.35"/>' +
        '<path d="M3.25 7.75 12 14.25 20.75 7.75" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>' +
        "</svg>"
      );
    }

    if (isActive) {
      return (
        '<svg class="pt-section-tab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M3.5 19.5V10.1l2.45-1.63V7.35h1.9V5.2h2.1v2.15h2.1V7.35h1.9v1.12l2.45 1.63v9.4H3.5Zm2.15-2.05h12.7v-6.95l-1.55-1.03V9.1h-1.45v1.55H8.65V9.1H7.2v1.37l-1.55 1.03v6.95Z" fill="currentColor"/>' +
        '<path d="M8.2 5.2v1.35M12 5.2v1.35M15.8 5.2v1.35M6.65 9.1h10.7M6.65 12.05h10.7M6.65 15h10.7" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="0.9" stroke-linecap="round"/>' +
        "</svg>"
      );
    }

    return (
      '<svg class="pt-section-tab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M3.5 19.5V10.1l2.45-1.63V7.35h1.9V5.2h2.1v2.15h2.1V7.35h1.9v1.12l2.45 1.63v9.4H3.5Z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>' +
      '<path d="M5.65 17.45V11.5l1.55-1.03V9.1h1.45v1.55h6.7V9.1h1.45v1.37l1.55 1.03v5.95" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>' +
      '<path d="M8.2 5.2v1.35M12 5.2v1.35M15.8 5.2v1.35" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function renderSectionTabs() {
    if (!modalSectionTabs) {
      return;
    }

    modalSectionTabs.innerHTML = "";

    if (!activeProject || !activeProject.sections || activeProject.sections.length <= 1) {
      modalSectionTabs.hidden = true;
      modalSectionTabs.removeAttribute("data-section-count");
      modal.classList.remove("has-sections");
      return;
    }

    modalSectionTabs.hidden = false;
    modal.classList.add("has-sections");
    modalSectionTabs.setAttribute("data-section-count", String(activeProject.sections.length));

    activeProject.sections.forEach(function (section, index) {
      var tab = document.createElement("button");
      var isActive = index === activeSectionIndex;
      tab.type = "button";
      tab.className = "pt-section-tab";
      tab.setAttribute("data-pt-section", String(index));
      tab.setAttribute("aria-label", section.label + " / " + (section.labelEn || ""));

      if (isActive) {
        tab.classList.add("is-active");
        tab.setAttribute("aria-current", "true");
      }

      tab.innerHTML =
        getSectionTabIcon(section.icon || "construct", isActive) +
        '<span class="pt-section-tab-copy">' +
        '<span class="pt-section-tab-cn">' + escapeHtml(section.label) + "</span>" +
        '<span class="pt-section-tab-en">' + escapeHtml(section.labelEn || "") + "</span>" +
        "</span>";
      modalSectionTabs.appendChild(tab);
    });
  }

  function getTotalSectionPages(project) {
    if (!project || !project.sections) {
      return 0;
    }

    var total = 0;

    project.sections.forEach(function (_, sectionIndex) {
      total += getProjectPages(project, sectionIndex).length;
    });

    return total;
  }

  function isAtGlobalFirstPage() {
    return activeSectionIndex === 0 && activePageIndex === 0;
  }

  function isAtGlobalLastPage() {
    if (!activeProject || !activePagedProject) {
      return true;
    }

    if (!activeProject.sections) {
      return activePageIndex >= activePagedProject.pages.length - 1;
    }

    return (
      activeSectionIndex >= activeProject.sections.length - 1 &&
      activePageIndex >= activePagedProject.pages.length - 1
    );
  }

  function setActiveSection(index, pageIndex) {
    if (!activeProject || !activeProject.sections) {
      return;
    }

    var nextIndex = clamp(index, 0, activeProject.sections.length - 1);
    var nextPages = getProjectPages(activeProject, nextIndex);
    var nextPageIndex = typeof pageIndex === "number"
      ? clamp(pageIndex, 0, Math.max(0, nextPages.length - 1))
      : 0;

    if (nextIndex === activeSectionIndex && activePagedProject && nextPageIndex === activePageIndex) {
      return;
    }

    activeSectionIndex = nextIndex;
    activePagedProject = {
      pages: nextPages
    };
    activePageIndex = nextPageIndex;
    renderSectionTabs();
    renderPageDots();
    setPagedPage(activePageIndex);
  }

  function fillModal(project) {
    activeProject = project;
    activeSectionIndex = 0;
    activePagedProject = {
      pages: getProjectPages(project, 0)
    };
    activePageIndex = 0;

    modal.classList.add("is-paged");
    modalCase.textContent = project.caseStudy;
    modalRole.textContent = project.role;
    modalTools.textContent = project.tools;
    modalOutcome.textContent = project.outcome;
    renderSectionTabs();
    renderPageDots();
    setPagedPage(0);
  }

  function renderPageDots() {
    modalPager.innerHTML = "";

    if (!activePagedProject) {
      modalPager.hidden = true;
      return;
    }

    if (activePagedProject.pages.length <= 1) {
      modalPager.hidden = true;
      return;
    }

    modalPager.hidden = false;
    activePagedProject.pages.forEach(function (_, index) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "pt-page-dot";
      dot.setAttribute("aria-label", "切换到第 " + (index + 1) + " 页");
      dot.setAttribute("data-pt-page", String(index));
      dot.setAttribute("aria-current", index === activePageIndex ? "true" : "false");
      modalPager.appendChild(dot);
    });
  }

  function setPagedPage(index) {
    if (!activePagedProject) {
      return;
    }

    activePageIndex = clamp(index, 0, activePagedProject.pages.length - 1);
    var page = activePagedProject.pages[activePageIndex];

    if (page.header) {
      modalYear.textContent = page.header;
    } else if (activePagedProject.pages.length === 1 && activeProject) {
      modalYear.textContent = activeProject.year || "";
    } else {
      modalYear.textContent = padPageNumber(activePageIndex) + " | " + page.label;
    }
    renderModalTitle(page.title || "");
    modalSubtitle.textContent = page.subtitle || "";
    modalSubtitle.hidden = !page.subtitle;
    renderModalIntro(page);
    modalIntro.scrollTop = 0;
    modal.classList.toggle("has-pdf-preview", Boolean(page.pdfEmbed));
    renderPageMedia(page);
    var modalPanel = modal.querySelector(".pt-modal-panel");
    if (modalPanel) {
      modalPanel.scrollTop = 0;
    }
    Array.from(modalPager.querySelectorAll(".pt-page-dot")).forEach(function (dot, dotIndex) {
      dot.setAttribute("aria-current", dotIndex === activePageIndex ? "true" : "false");
    });
    updateScrollUi();
    updateVisualNav();
  }

  function canShowVisualNav() {
    if (!activePagedProject || !activeProject || !modal.classList.contains("is-open")) {
      return false;
    }

    if (activeProject.visualNav === false) {
      return false;
    }

    if (activeProject.sections) {
      return getTotalSectionPages(activeProject) > 1;
    }

    return activePagedProject.pages.length > 1;
  }

  function updateVisualNav() {
    if (!modalVisualPrev || !modalVisualNext) {
      return;
    }

    var showNav = canShowVisualNav();

    modalVisualPrev.hidden = !showNav || isAtGlobalFirstPage();
    modalVisualNext.hidden = !showNav || isAtGlobalLastPage();

    if (modalVisualNavRail) {
      modalVisualNavRail.setAttribute("aria-hidden", showNav ? "false" : "true");
    }
  }

  function highlightScrollbar() {
    if (!modalIntro) {
      return;
    }

    modalIntro.classList.add("is-scroll-active");
    window.clearTimeout(scrollHighlightTimer);
    scrollHighlightTimer = window.setTimeout(function () {
      modalIntro.classList.remove("is-scroll-active");
    }, 900);
  }

  function updateScrollUi() {
    if (!modalIntro) {
      return;
    }

    window.requestAnimationFrame(function () {
      var canScroll = modalIntro.scrollHeight > modalIntro.clientHeight + 2;
      modalIntro.classList.toggle("has-scroll", canScroll);
    });
  }

  function isLocalPreview() {
    var host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "";
  }

  function shouldUseTimestampBust() {
    return new URLSearchParams(window.location.search).has("debugAssets");
  }

  function resolveVisualUrl(visual, rev) {
    if (!visual) {
      return "";
    }

    var bust = rev || IMAGE_CACHE_VERSION;

    if (isLocalPreview() && shouldUseTimestampBust()) {
      bust = String(Date.now());
    }

    if (!bust) {
      return visual;
    }

    return visual + (visual.indexOf("?") >= 0 ? "&" : "?") + "v=" + encodeURIComponent(bust);
  }

  function preloadImage(src, rev) {
    if (!src) {
      return Promise.resolve("");
    }

    var url = resolveVisualUrl(src, rev);

    if (imagePreloadCache.has(url)) {
      return imagePreloadCache.get(url);
    }

    var promise = new Promise(function (resolve) {
      var img = new Image();
      img.decoding = "async";

      img.onload = function () {
        resolve(url);
      };
      img.onerror = function () {
        console.warn("[portfolio timeline] Failed to preload image:", src);
        resolve("");
      };
      img.src = url;
    });

    imagePreloadCache.set(url, promise);
    return promise;
  }

  function renderPageMedia(page) {
    var renderId = visualRenderId + 1;
    visualRenderId = renderId;
    modalVisual.innerHTML = "";
    modalVisual.style.backgroundImage = "";
    modalVisual.classList.remove("has-video", "has-pdf", "is-loading", "is-empty");

    if (page.videoEmbed) {
      modalVisual.classList.add("has-video");
      modalVisual.innerHTML = "<iframe src=\"" + page.videoEmbed + "\" title=\"" + (page.title || "Project video preview") + "\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" allowfullscreen></iframe>";
      return;
    }

    if (page.pdfEmbed) {
      modalVisual.classList.add("has-pdf");
      var pdfUrl = resolveVisualUrl(page.pdfEmbed, page.pdfRev);
      modalVisual.innerHTML =
        "<object class=\"pt-pdf-frame\" data=\"" + pdfUrl + "\" type=\"application/pdf\" aria-label=\"" + (page.title || "PDF preview") + "\">" +
        "<embed class=\"pt-pdf-frame\" src=\"" + pdfUrl + "\" type=\"application/pdf\" />" +
        "<p class=\"pt-pdf-fallback\">若预览未显示，请 <a href=\"" + pdfUrl + "\" target=\"_blank\" rel=\"noopener\">在新标签页打开 dashen_ppt.pdf</a></p>" +
        "</object>";
      return;
    }

    if (page.visual) {
      modalVisual.classList.add("is-loading");
      preloadImage(page.visual, page.visualRev).then(function (url) {
        if (renderId !== visualRenderId) {
          return;
        }

        modalVisual.classList.remove("is-loading");
        if (!url) {
          modalVisual.classList.add("is-empty");
          return;
        }

        modalVisual.style.backgroundImage = "url(\"" + url + "\")";
      });
      return;
    }

    modalVisual.classList.add("is-empty");
  }

  function canTurnPage() {
    if (!activePagedProject || !activeProject || !modal.classList.contains("is-open")) {
      return false;
    }

    if (activeProject.sections) {
      return getTotalSectionPages(activeProject) > 1;
    }

    return activePagedProject.pages.length > 1;
  }

  function canScrollElement(element, deltaY) {
    if (!element) {
      return false;
    }

    if (deltaY < 0) {
      return element.scrollTop > 0;
    }

    if (deltaY > 0) {
      return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
    }

    return false;
  }

  function scrollModalIntro(deltaY) {
    if (!modalIntro || !deltaY) {
      return false;
    }

    if (!canScrollElement(modalIntro, deltaY)) {
      return false;
    }

    modalIntro.scrollTop += deltaY;
    updateScrollUi();
    highlightScrollbar();
    return true;
  }

  function shouldKeepNestedScroll(target, deltaY) {
    if (!target || typeof target.closest !== "function") {
      return false;
    }

    var nestedScroller = target.closest(".pt-summary-body");

    return Boolean(nestedScroller && canScrollElement(nestedScroller, deltaY));
  }

  function turnPage(direction) {
    if (!canTurnPage()) {
      return;
    }

    var now = Date.now();
    if (now - lastPageTurn < 420) {
      return;
    }

    lastPageTurn = now;

    if (direction > 0) {
      if (activePageIndex < activePagedProject.pages.length - 1) {
        setPagedPage(activePageIndex + 1);
        return;
      }

      if (activeProject.sections && activeSectionIndex < activeProject.sections.length - 1) {
        setActiveSection(activeSectionIndex + 1, 0);
      }

      return;
    }

    if (direction < 0) {
      if (activePageIndex > 0) {
        setPagedPage(activePageIndex - 1);
        return;
      }

      if (activeProject.sections && activeSectionIndex > 0) {
        var prevSectionIndex = activeSectionIndex - 1;
        var prevPages = getProjectPages(activeProject, prevSectionIndex);
        setActiveSection(prevSectionIndex, Math.max(0, prevPages.length - 1));
      }
    }
  }

  function handleModalWheel(event) {
    if (Math.abs(event.deltaY) >= Math.abs(event.deltaX) && Math.abs(event.deltaY) > 0) {
      if (shouldKeepNestedScroll(event.target, event.deltaY)) {
        return;
      }

      if (scrollModalIntro(event.deltaY)) {
        event.preventDefault();
      }

      return;
    }

    if (!canTurnPage()) {
      return;
    }

    if (Math.abs(event.deltaX) < 18 || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
      return;
    }

    event.preventDefault();
    turnPage(event.deltaX > 0 ? 1 : -1);
  }

  function handleSwipeStart(clientX, clientY) {
    if (!canTurnPage()) {
      return;
    }

    swipeStartX = clientX;
    swipeStartY = clientY;
    swipeTracking = true;
  }

  function handleSwipeEnd(clientX, clientY) {
    if (!swipeTracking) {
      return;
    }

    swipeTracking = false;

    var deltaX = clientX - swipeStartX;
    var deltaY = clientY - swipeStartY;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
      return;
    }

    if (Math.abs(deltaY) > SWIPE_MAX_VERTICAL && Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    turnPage(deltaX < 0 ? 1 : -1);
  }

  function openModal(index) {
    var project = projects[index];

    if (!project) {
      return;
    }

    lastFocusedElement = document.activeElement;
    lockedScrollY = window.scrollY;
    fillModal(project);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("pt-modal-lock");
    document.body.style.top = "-" + lockedScrollY + "px";
    window.dispatchEvent(new CustomEvent("pt:portfolio-modal-toggle", {
      detail: {
        isOpen: true,
        lockedScrollY: lockedScrollY
      }
    }));
    modal.querySelector(".pt-close").focus({ preventScroll: true });
    updateScrollUi();
    updateVisualNav();
  }

  function closeModal() {
    if (!modal.classList.contains("is-open")) {
      return;
    }

    modal.classList.remove("is-open");
    modal.classList.remove("is-paged");
    modal.classList.remove("has-sections");
    modal.classList.remove("has-pdf-preview");
    modal.setAttribute("aria-hidden", "true");
    modalVisual.innerHTML = "";
    modalVisual.classList.remove("has-video", "has-pdf");
    activePagedProject = null;
    activeProject = null;
    activeSectionIndex = 0;
    activePageIndex = 0;
    swipeTracking = false;
    modalSubtitle.hidden = false;
    modalPager.hidden = true;
    modalPager.innerHTML = "";
    if (modalVisualPrev) {
      modalVisualPrev.hidden = true;
    }
    if (modalVisualNext) {
      modalVisualNext.hidden = true;
    }
    if (modalVisualNavRail) {
      modalVisualNavRail.setAttribute("aria-hidden", "true");
    }
    if (modalSectionTabs) {
      modalSectionTabs.hidden = true;
      modalSectionTabs.innerHTML = "";
      modalSectionTabs.removeAttribute("data-section-count");
    }
    if (modalIntro) {
      modalIntro.classList.remove("has-scroll", "is-scroll-active");
    }
    window.clearTimeout(scrollHighlightTimer);
    document.body.classList.remove("pt-modal-lock");
    document.body.style.top = "";
    window.scrollTo(0, lockedScrollY);
    window.dispatchEvent(new CustomEvent("pt:portfolio-modal-toggle", {
      detail: {
        isOpen: false,
        lockedScrollY: lockedScrollY
      }
    }));

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus({ preventScroll: true });
    }
  }

  projectButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      openModal(Number(button.getAttribute("data-pt-project")));
    });
  });

  closeControls.forEach(function (control) {
    control.addEventListener("click", closeModal);
  });

  modal.addEventListener("wheel", handleModalWheel, { passive: false });
	  modal.addEventListener("touchstart", function (event) {
	    if (!event.changedTouches.length) {
	      return;
	    }

	    var touch = event.changedTouches[0];
	    touchLastY = touch.clientY;
	    handleSwipeStart(touch.clientX, touch.clientY);
	  }, { passive: true });
	  modal.addEventListener("touchmove", function (event) {
	    if (!event.changedTouches.length) {
	      return;
	    }

	    var touch = event.changedTouches[0];
	    var deltaX = Math.abs(touch.clientX - swipeStartX);
	    var deltaY = Math.abs(touch.clientY - swipeStartY);
	    var scrollDeltaY = touchLastY - touch.clientY;
	    touchLastY = touch.clientY;

	    if (deltaY > deltaX && deltaY > 12) {
	      swipeTracking = false;

	      if (shouldKeepNestedScroll(event.target, scrollDeltaY)) {
	        return;
	      }

	      if (scrollModalIntro(scrollDeltaY)) {
	        event.preventDefault();
	      }
	    }
	  }, { passive: false });
  modal.addEventListener("touchend", function (event) {
    if (!event.changedTouches.length) {
      return;
    }

    var touch = event.changedTouches[0];
    handleSwipeEnd(touch.clientX, touch.clientY);
  }, { passive: true });
  modal.addEventListener("pointerdown", function (event) {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    handleSwipeStart(event.clientX, event.clientY);
  });
  modal.addEventListener("pointerup", function (event) {
    if (event.pointerType !== "mouse") {
      return;
    }

    handleSwipeEnd(event.clientX, event.clientY);
  });
  if (modalVisualPrev) {
    modalVisualPrev.addEventListener("click", function () {
      turnPage(-1);
    });
  }

  if (modalVisualNext) {
    modalVisualNext.addEventListener("click", function () {
      turnPage(1);
    });
  }

  modalPager.addEventListener("click", function (event) {
    var dot = event.target.closest("[data-pt-page]");

    if (dot) {
      setPagedPage(Number(dot.getAttribute("data-pt-page")));
    }
  });

  if (modalSectionTabs) {
    modalSectionTabs.addEventListener("click", function (event) {
      var tab = event.target.closest("[data-pt-section]");

      if (tab) {
        setActiveSection(Number(tab.getAttribute("data-pt-section")));
      }
    });
  }

  modalIntro.addEventListener("click", function (event) {
    var tabButton = event.target.closest("[data-pt-intro-tab]");

    if (!tabButton) {
      return;
    }

    var tabRoot = tabButton.closest("[data-pt-intro-tabs]");
    var tabIndex = tabButton.getAttribute("data-pt-intro-tab");

    if (!tabRoot) {
      return;
    }

    tabRoot.querySelectorAll("[data-pt-intro-tab]").forEach(function (button) {
      var isActive = button.getAttribute("data-pt-intro-tab") === tabIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    tabRoot.querySelectorAll("[data-pt-intro-panel]").forEach(function (panel) {
      var isActive = panel.getAttribute("data-pt-intro-panel") === tabIndex;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });

    updateScrollUi();
    highlightScrollbar();
  });

  modalIntro.addEventListener("scroll", function () {
    updateScrollUi();
    highlightScrollbar();
  }, { passive: true });
  modalIntro.addEventListener("wheel", highlightScrollbar, { passive: true });
  modalIntro.addEventListener("pointerdown", highlightScrollbar);

  if (!isEmbedMode) {
    window.addEventListener("scroll", requestTick, { passive: true });
  }
  window.addEventListener("resize", function () {
    measure();
    updateScrollUi();
  });
  window.addEventListener("load", measure);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (!canTurnPage()) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      turnPage(1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      turnPage(-1);
    }
  });

  measure();
  if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === "function") {
    window.requestAnimationFrame(function () {
      window.ScrollTrigger.refresh();
    });
  }
})();
