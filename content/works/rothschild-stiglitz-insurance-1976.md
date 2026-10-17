---
title: "Reading Rothschild and Stiglitz on competitive insurance"
abstract: "A guide to screening when customers know their risk and insurers cannot directly observe it. Price and coverage jointly determine who chooses a policy; even a self-selecting menu need not survive competition."
status: needs-review
citation_ids: [rothschild-stiglitz-1976, academy-2001]
topic_slugs: [information-economics]
featured_work_ids: []
source_version: "QJE 90(4), 629–649; JSTOR facsimile at University of Houston. Introduction and section I through welfare discussion, PDF pages 2–11 (printed 629–638), consulted; later robustness sections not fully read."
review: null
---

## The research question

What happens when insurance customers know their accident probabilities but insurers do not? Rothschild and Stiglitz analyze competition through contracts specifying both price and coverage. The central question is not simply what premium covers an average loss. A policy changes who buys it, and an entrant can offer a different combination that attracts a selected group. [@rothschild-stiglitz-1976]

The academy discusses the jointly authored paper in explaining Stiglitz's screening contribution to the 2001 award. Michael Rothschild is a coauthor, not a 2001 laureate, and the distinction is retained here. [@academy-2001]

## How the argument works

Customers are risk averse and differ in accident probability. Insurers are risk neutral, cannot observe each customer's type and compete by offering policies. The basic model restricts each customer to one contract. With observable types, actuarially fair full insurance can remove risk separately for each group. Hidden types make the low-risk policy attractive to high-risk customers too. [@rothschild-stiglitz-1976]

Here is an original teaching menu, not the paper's estimated data or equilibrium. Wealth is 100 and an accident causes loss 64. Utility is the square root of wealth; accident probabilities are 0.1 and 0.4. One policy fully reimburses the loss for premium 25.6. Another reimburses only 4 for premium 0.4. Premiums are paid in either state.

The full policy leaves wealth 74.4 in both states, giving utility about 8.626. The partial policy leaves 99.6 without an accident and 39.6 with one. Expected utility is about 9.611 for the low-risk type and 8.505 for the high-risk type.

The low-risk customer chooses partial coverage; the high-risk customer chooses full coverage. Each policy breaks even for its intended buyer because $0.1(4)=0.4$ and $0.4(64)=25.6$. Both also improve on the corresponding uninsured expected utilities, 9.6 and 8.4.

These checks establish participation, self-selection and break-even for this menu. They do **not** establish a competitive equilibrium: an entrant may be able to offer a preferred profitable policy, and the low-risk coverage here has not been optimized.

## A little more rigor

Let $W$ be initial wealth, $d$ the loss, $P$ the premium and $I$ the indemnity paid if an accident occurs. A type with accident probability $p$ values a policy by

$$
V_p(P,I)=(1-p)u(W-P)+p\,u(W-d-P+I).
$$

Expected insurer profit before administrative costs is

$$
\pi_p(P,I)=P-pI.
$$

A separating menu $(P_L,I_L)$ and $(P_H,I_H)$ must satisfy both types' incentive comparisons, for example

$$
V_{p_H}(P_H,I_H)\geq V_{p_H}(P_L,I_L).
$$

The corresponding low-risk inequality and participation constraints are also required. This notation uses gross indemnity and a premium paid in both states; it differs from the original paper's net state-transfer coordinates.

The full-information low-risk contract in the example would fully insure for premium 6.4, leaving wealth 93.6. A high-risk customer would prefer that to wealth 74.4. It therefore cannot simply be added as an exclusively low-risk option when type is unobservable.

## What the paper does and does not establish

The basic analysis rules out pooling equilibrium under its assumptions. Any equilibrium must separate, with full insurance for high risks and constrained coverage for low risks. Crucially, the candidate separating arrangement may itself be upset by another offer. For some parameter configurations no equilibrium exists under the paper's competition concept. [@rothschild-stiglitz-1976]

That nonexistence result concerns a defined model. It does not mean actual insurers cannot operate or that every possible institution lacks equilibrium. The consulted welfare discussion also warns that competitive separation need not be Pareto optimal even with the information constraint.

## Assumptions and reading cautions

Exclusivity, free entry, the information structure and firms' responses to deviations matter. Multiple insurance purchases, administrative costs or a different equilibrium concept can change the analysis. Hidden risk type is also distinct from moral hazard: this basic example does not let coverage change the accident probability.

The numerical menu is deliberately a feasibility exercise rather than a claimed replication. This draft draws on the introduction and basic-model/welfare sections. The later robustness discussion and subsequent literature still require full review, and no independent approval is implied.

## Access and versions

The original is *Quarterly Journal of Economics* 90(4), 629–649 (1976), DOI 10.2307/1885326. Its publication details and selected sections were checked in a university-hosted JSTOR facsimile. That private reading copy is not redistributed, and no original EPUB or conversion permission is inferred. The site's PDF and EPUB downloads contain this explanation; original access remains through the publisher link. [@rothschild-stiglitz-1976]
