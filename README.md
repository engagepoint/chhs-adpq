# CWS Parent Portal

ADPQ prototype URL:

## User guide
Application provides several roles: PARENT, CASE_WORKER and ADMIN. 
Demo user with role PARENT: </br>
    - name: parent, password: parent</br>
Demo uses with role CASE_WORKER: </br>
    - name: worker, password: worker</br>
    - name: maryjenkins, password: worker</br>
Demo user with role ADMIN:</br>
    - name: admin, password: admin

After registration and activation of account using email, user receives role PARENT.</br>
Application provide different capabilities for different roles. </br>
Parents can communicate with caseworkers using private inbox.

# Technical approach

## 1. Project Goals, Objectives, and Task Definition

EngagePoint understands the design, development, and implementation required to develop a prototype using open source technologies. California requested a system to serve parents of foster children. Ours serves parents of foster children, in addition to other users such as foster parents, guardians, and authorized representatives. This prototype, an automated modern web application, scales horizontally and can be deployed to an Infrastructure as a Service (IaaS) or Platform as a Service (PaaS) provider.

## 2. User-centric design approach

EngagePoint applied user-centric design principles in creating the prototype by following the US Digital Services Playbook. See Playbook (Play 1 - Play 3) and Requirements C - F for information.

## 3. Agile Methodology

To implement the prototype, we modified our Scrum methodology to align with the user-centric design. Our approach is detailed in Requirement G and US Digital Services Playbook Play 4.

## 4. Technical architecture

EngagePoint selected the Java Virtual Machine (JVM) platform and Java 1.8 as the prototype's programming language. The JVM platform is commonly used in high-load web applications, such as Google. However, small prototype web applications can be created quickly and then transitioned to production usage on the same technology platform without having to rewrite the application.

Using the JVM platform for prototype development is the correct choice due to scalability and maturity of Java as an industry standard.

We adhere to these factors to maximize performance:

- Leverage a generic application platform for prototype construction
- Use code generators rather than boilerplate code
- Minimize time for the code-compile-test-deploy cycle

To minimize risk, we considered these factors for each system architecture component:

- Maturity level
- Success stories
- Documentation quality
- Cloud readiness
- Performance metrics
- Maintenance costs

### 4.1. Application Platform

EngagePoint used the open source code generator  [JHipster](https://jhipster.github.io/), allowing generate a production-ready application using  [Spring Boot](http://projects.spring.io/spring-boot/) and  [AnglarJS](https://angularjs.org/), which contain monitoring, logging, configuration, and user management functionality.

JHipster lets us choose technologies based on project requirements. For the prototype, EngagePoint chose this technology stack:

![Architectural diagram](/documents/Images/Architecture.png?raw=true)

## 4.2. Rationale

The table below lists EngagePoint's architectural design decisions and their alignment with the functional and non-functional requirements.

| Application Requirements | Technologies | Motivation and rationale |
| --- | --- | --- |
| Modern Web Application | HTML5, CSS3, [AngularJS](https://angularjs.org/) | AngularJS has decent documentation and an active GitHub community with lots of open components |
| Responsive UI | [Bootstrap](http://getbootstrap.com/) | Simplifies responsive UI implementation complexity providing CSS and JS. |
| Allow foster parents to communicate with the case worker via a private inbox | [Elasticsearch](https://www.elastic.co/products/elasticsearch), [PostgreSQL](https://www.postgresql.org/), [Websockets](https://en.wikipedia.org/wiki/WebSocket), [HibernateORM](http://hibernate.org/orm/) | Elasticsearch implements search capabilities needed for inbox functionality like full-text search, relevancy, ranking, and fuzzy search. <br/>- We are using the relational database for the persistence of messages in the private inbox. Prototype is database agnostic. PostgreSQL is our open source choice.<br/>- Websockets technology is used for real-time notifications for new messages. |
| Allow foster parents to view children's residential facilities in their zip code | [Leaflet](http://leafletjs.com/) [Mapzen Search](https://mapzen.com/projects/search/?lng=-76.67925&lat=39.01412&zoom=12) | - Leaflet is the leading open-source JavaScript library for mobile-friendly interactive maps. <br/>- Mapzen Search is an open source geocoding tool used for address lookup capabilities. |
| Allow foster parents to establish and manage their profile | [JHipster](https://jhipster.github.io/) [Hazelcast](http://hazelcast.org/) | - Generic JHipster application has built-in login, registration, and user profile functionality. EngagePoint has customized the generic implementation.<br/>- Hazelcast is a distributed data grid used for distributed cache capabilities and performance improvement of the application. For the prototype, we are storing user sessions as well as L2 Hibernate cache.|
| Automated deployment to IaaS, PaaS | [Spring Boot](http://projects.spring.io/spring-boot/), [Docker](https://www.docker.com/), [Jenkins](https://jenkins.io/) | - Spring Boot provides DevOps tools like externalized configuration, monitoring, and logging. Spring Boot eliminates the need to use external application containers, simplifying cloud deployment. <br/>- Docker containers are used for all components of application infrastructure (application, Elasticsearch server, PostgreSQL server). Containerization helps with automated deployment and makes application environments agnostic. <br/>- Jenkins is an open source tool used to implement continuous integration and delivery. |

### 4.3. Development Tools

JHipster provides tools that accelerate development and minimize custom coding. Entity Generator supports application prototyping, allowing the Technical Architect to describe the Entity Relational Diagram using JDL (domain specific language). Based on JDL, JHipster generates boilerplate code for simple CRUD operations with these entities:  [Liquibase](http://www.liquibase.org/) scripts for database objects, Hibernate entities, repository classes, Java REST resources, AngularJS controllers, REST client services, routers, unit tests for Java and JavaScript, and sample administrative UI.

The prototype has two [Maven](https://maven.apache.org/) profiles: DEV and PROD. The DEV profile is used on the local development environment and incorporates in-memory H2 and Elasticsearch engines. Spring Boot provides an embedded lightweight application container, Tomcat, which runs the prototype. We used  [Browsersync](https://www.browsersync.io/) and  [Spring Boot Devtools](http://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-devtools.html) for automated reload of front-end and back-end code. These techniques reduce development time as developers view real-time updates. The PROD profile builds the prototype's production version, which is optimized for production use.

### 4.4. Automated testing

These automated testing tools ensure that the prototype meets California's requirements:

- [Junit](http://junit.org/junit4/) - Java unit tests
- [Spring Boot integration testing tools](http://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-testing.html) - Java integration tests
- [Karma JS](https://karma-runner.github.io/0.13/index.html) - JavaScript unit tests
- [Gatling](http://gatling.io/#/) - Load testing
- BDD framework  [Cucumber](https://cucumber.io/) - Acceptance testing

### 4.5. Deployment Approach

We used  [Jenkins](https://jenkins.io/) as a continuous integration and delivery tool. Containerization using  [Docker](https://www.docker.com/) is the best approach for application delivery to target environments. Please refer to  [Requirements J, L-O](https://chhs-apqd.atlassian.net/wiki/pages/viewpage.action?pageId=2949131) for information.

## 5. Summary

EngagePoint conducted these prototype implementation steps:

1.    Performed 1:1 interviews and documented results
2.    Developed an interactive wireframe and performed usability testing with users
3.    Developed user interface mock-ups using  [U.S. Web Design Standards](https://standards.usa.gov/) in compliance with [ADA508](https://www.section508.gov/)
4.    Generated a generic web application using JHipster with an appropriate technology stack
5.    Configured continuous integration and automated testing using [Jenkins](https://jenkins.io/)
6.    Designed a data model and generated code artifacts using JHipster's entity generator
7.    Developed custom user interfaces according to design mockups and integrated them into a generic application
8.    Modified the front-end and back-end code to support ADPQ functionality

For each development stage, we created automated tests (and performance and acceptance tests) for Java and JavaScript code. [SonarQube](http://www.sonarqube.org/) controlled code quality, incorporated in an automated continuous delivery workflow that was implemented in  [Jenkins](https://jenkins.io/). We also manually reviewed code to ensure quality.
With this approach, we  implemented a modern, mobile friendly, cloud-ready web application in only three weeks.

#  References

| **#** | **Requirement** | **Description** |
| --- | --- | --- |
| 1. |a. Assigned one leader and gave that person authority and responsibility and held that person accountable for the quality of the prototype submitted. |  Agile ADPQ Product Manager (Margreta) |
| 2. |b. Assembled a multidisciplinary and collaborative team that includes, at a minimum, five of the labor categories as identified in Attachment C - ADPQ Vendor Pool Labor Category Descriptions. |- Agile ADPQ Product Manager (Margreta)<br/>- Delivery Manager / Technical Architect (Leonid)<br/>- Interaction Designer (Dariia)<br/>- Business Analyst / User Researcher (Pavel)<br/>- Security Engineer (Dmitry)<br/>- DevOps Engineer (Dmytro)<br/>- Front End Developer (Yevhen, Oleksander)<br/>- Back End Web Developer (Oleg, Alexander, Alexander, Serge) |
| 3. |c. Understood what people needed, by including people in the prototype development and design process | EngagePoint listened to user needs and reviews and incorporated users' perspectives in the development process. After initial review and initial scope design, the [information and understanding of need](https://github.com/engagepoint/chhs-adpq/blob/develop/documents/UX-Design/Initial-Vision-Sitemap.pdf)is discussed with the stakeholders (users). EngagePoint identified two users (Shelly & Kacie) to function in this role for our effort. The initial interviews ( [Shelly](https://github.com/engagepoint/chhs-adpq/blob/develop/documents/UX-Design/Interviews/01-Shelly-05202016.pdf) & [Kacie](https://github.com/engagepoint/chhs-adpq/blob/develop/documents/UX-Design/Interviews/02-Kacie-05232016-080616-2126-20.pdf)) resulted in a [high level identification and validation of needs](https://github.com/engagepoint/chhs-adpq/tree/develop/documents/UX-Design/User-Needs).Additional interviews with users provided feedback on the prototype development as well as additional clarification on [specific features and interactions](https://github.com/engagepoint/chhs-adpq/blob/develop/documents/UX-Design/User-Stories-Scenarios.pdf)expected with the system. [Feedback sessions](https://github.com/engagepoint/chhs-adpq/tree/develop/documents/UX-Design/Interviews) provided specific recommendations on what information is of value (examples include feedback regarding facility search features and the specifying the types of communication needs that should be supported between the parent and the caseworker).  Other users were also included in reviewing the wireframes and [providing feedback](https://github.com/engagepoint/chhs-adpq/tree/develop/documents/UX-Design/Interviews/Local-User-Interview) on how a specific action might be performed. |
| 4. |d. Used at least three "human-centered design" techniques or tools | During application prototype development we used the following "human-centered design" techniques and tools.<br/>-  [User Interview](https://github.com/engagepoint/chhs-adpq/tree/develop/documents/UX-Design/Interviews)<br/>-  [Expert Interview](https://github.com/engagepoint/chhs-adpq/tree/develop/documents/UX-Design/Interviews)<br/>-  [User Needs](https://github.com/engagepoint/chhs-adpq/blob/develop/documents/UX-Design/User-Needs.pdf)<br/>-  [User Personas](https://chhs-apqd.atlassian.net/wiki/display/APQD/03.+User+Personas)<br/>-  [User Stories & Scenarios](https://github.com/engagepoint/chhs-adpq/blob/develop/documents/UX-Design/User-Stories-Scenarios.pdf)<br/>-  [Wirefra](https://chhs-apqd.atlassian.net/wiki/display/APQD/05.+List+of+Axure+wireframe+versions) [ming](https://github.com/engagepoint/chhs-adpq/blob/develop/documents/UX-Design/Axure-Wireframe-Versions.pdf)<br/>-  [Usability Testing](https://github.com/engagepoint/chhs-adpq/tree/develop/documents/UX-Design/Usability-Testing)<br/>-  [Design mockups](https://chhs-apqd.atlassian.net/wiki/display/APQD/08.+Pages+in+Design)<br/>For our team, interactive wireframes play an important part in human-centric design approach. Wireframes provide the ability to quickly prototype and validate design ideas with users. The interactive wireframe is also a useful input for the application development team. Properly organized design stage activities minimize the need to rework the actual application in later stages, when the cost of changes will be much more expensive.  Additional information regarding the EngagePoint Design process can be found within the [UX Design Process](https://github.com/engagepoint/chhs-adpq/tree/develop/documents/UX-Design). |
| 5. |e. Created or used a design style guide and/or a pattern library | EngagePoint used the [U.S. Web Design Standards](https://playbook.cio.gov/designstandards) to track with industry-standard web-accessibility guidelines alongside best practices of existing style libraries and modern web design. [U.S. Web Design Standards](https://playbook.cio.gov/designstandards) provided a guide for creating visually appealing and easy-to-use online experiences for the American people. |
| 6. |f. Performed usability tests with people | With the iterative design approach, usability testing was performed iteratively. The initial usability tests asked general users to perform specific tasks, per the [scenarios](https://github.com/engagepoint/chhs-adpq/tree/develop/documents/UX-Design/Usability-Testing), within the Axure prototype. Feedback was also gathered regarding the overall interface look and feel, expected navigation behavior, and expected results of actions. Usability also addressed overall satisfaction with the design according to the overall goals identified.See artifacts within [UX Design Process](https://github.com/engagepoint/chhs-adpq/blob/develop/documents/UX-Design/UX-Design-Process.pdf)for user feedback, including  [local users](https://github.com/engagepoint/chhs-adpq/tree/develop/documents/UX-Design/Interviews/Local-User-Interview) input.Within the development effort, specific tasks have been divided into particular steps. These steps are documented in JIRA for traceability. The prototype testing process is thus supported and repeated within the development process. |
| 7. |g. Used an iterative approach, where feedback informed subsequent work or versions of the prototype | See the [Agile Approach Overview](https://github.com/engagepoint/chhs-adpq/blob/develop/documents/Agile/ADPQ-Agile-Approach-Overview.pdf)for a description of the iterative process used. According to the methodology, we have used a short, two-day iteration for the Design Group and a one-week iteration for application prototype development. Three times a week we held Design Sessions to review wireframes, to review design mockups, and to gather feedback from team members on design artifacts. Examples include recorded design sessions and [meeting notes](https://github.com/engagepoint/chhs-adpq/tree/develop/documents/Agile/Design-Sessions).Every week we held a Sprint Demo meeting to demonstrate the application prototype in front of the Product Manager and other interested stakeholders. Notes and action items are captured in [Sprint Demo meeting notes](https://github.com/engagepoint/chhs-adpq/tree/develop/documents/Agile/Sprint-Demos) [.](../../C:%5Cwiki%5Cdisplay%5CAPQD%5CSprint+Demos)Per our user-centric design approach, we focused on users' input and feedback. We conducted regular interviews with the people defined in item C above, as well as usability testing with other users. [Interview transcripts](https://github.com/engagepoint/chhs-adpq/tree/develop/documents/UX-Design/Interviews) and recordings of interviews can be found in GitHub repository. Based on user's feedback we [iteratively evolved wireframes](https://github.com/engagepoint/chhs-adpq/blob/develop/documents/UX-Design/Axure-Wireframe-Versions.pdf).<br/><br/>Over the course of three weeks, the development team has implemented three versions of application prototype: 0.1, 0.2, and 1.0. |
| 8. | h. Created a prototype that works on multiple devices, and presents a responsive design | Along with wireframes for the desktop version, we also maintained a wireframe for a mobile version [http://zfsh7d.axshare.com/inbox.html](http://zfsh7d.axshare.com/inbox.html), [http://ive2qq.axshare.com/home.html](http://ive2qq.axshare.com/home.html) (Password: 123654789). Based on the wireframes, we produced design mockups for a mobile version. Both wireframe and design mockups became requirements for the final application.To implement a responsive UI in the application prototype, we used the  [Bootstrap](http://getbootstrap.com/) framework. Bootstrap is an HTML, CSS, and JS framework for developing responsive, mobile first projects on the web. It provides the mechanisms necessary to implement application user interfaces that vary according to device resolution.  See the  [list of Axure mockups](https://github.com/engagepoint/chhs-adpq/blob/develop/documents/UX-Design/Axure-Wireframe-Versions.pdf) within  [UX Design Process](https://github.com/engagepoint/chhs-adpq/blob/develop/documents/UX-Design/UX-Design-Process.pdf). |
| 9. | i. Used at least five modern (see Note #2) and open-source technologies, regardless of architecturallayer(frontend, backend, etc.) | EngagePoint used the following open-source technologies in creating this prototype application. The list includes the named technologies, their versions, and links to the website with release notes or proof of date of release.Frontend (files [package.json](https://github.com/engagepoint/chhs-adpq/blob/develop/package.json) for NPM packages and [bower.json](https://github.com/engagepoint/chhs-adpq/blob/develop/bower.json) for Bower packages)<br/>-  [Bootstrap](http://getbootstrap.com/) 3.3.5: [release 06/15/2015](http://blog.getbootstrap.com/2015/06/15/bootstrap-3-3-5-released/)<br/>-  [UI Bootstrap](http://angular-ui.github.io/bootstrap/) 1.2.5: [release 03/20/2016](https://github.com/angular-ui/bootstrap/releases/tag/1.2.5)<br/>-  [AngularJS](https://angularjs.org/) 1.4.8: [release date](https://github.com/angular/code.angularjs.org/tree/master/1.4.8) [11/20/2015](https://github.com/angular/code.angularjs.org/tree/master/1.4.8)<br/>-  [Bower](http://bower.io/)1.7.9: [released 04/05/2016](https://www.versioneye.com/nodejs/bower/1.7.9)<br/>-  [Grunt](http://gruntjs.com/)0.4.5: [released 05/12/2014](http://gruntjs.com/blog/2014-05-12-grunt-0.4.5-released)<br/>-  [Karma JS](http://karma-runner.github.io/0.13/index.html) 0.13.19: [release 01/06/2016](http://karma-runner.github.io/0.13/about/changelog.html)<br/>Backend (dependencies and versions are in Maven [pom.xml](https://github.com/engagepoint/chhs-adpq/blob/develop/pom.xml) file)<br/>-  [Spring Boot](http://projects.spring.io/spring-boot/) 1.3.1: [release 12/18/2015](https://spring.io/blog/2015/12/18/spring-boot-1-3-1-and-1-2-8-available-now)<br/>-  [Elasticsearch](https://www.elastic.co/products/elasticsearch) 1.5.2: [release 04/27/2015](https://www.elastic.co/blog/elasticsearch-1-5-2-and-1-4-5-released)<br/>-  [Hazelcast](http://hazelcast.org/) 3.5.4: [release 11/25/2015](http://hazelcast.org/download/archives/)<br/>-  [Liquibase](http://www.liquibase.org/) 3.4.2:  [release 11/24/2015](http://www.liquibase.org/2015/11/liquibase-3-4-2-released.html) |
| 10. |  j. Deployed the prototype on an Infrastructure as a Service (Iaas) or Platform as Service (Paas) provider, and indicated which provider they used. | Amazon cloud is the deployment target for the prototype application.Two types of environment were implemented:<br/>1. Traditional EC2 based environment with Linux based instance.<br/>In this case we created a Virtual Machine (VM) based on any Linux image which supports Docker engine. After creating the VM we install Docker Engine and Docker compose. The Prototype is deployed based on the Docker Compose file, which creates, configures, and runs the application itself; all necessary requirements; and the Load Balancer. We can scale the Prototype's container count, which will be handled by Load Balancer automatically.<br/>2. Clustered environment based on EC2 Container Service (ECS)<br/>In this case for the Prototype, we create ECS cluster based on Auto Scaling Group (ESG) of EC2 instances with Elastic Load Balancer (ELB). We can configure various rules in ESG to add and remove EC2 instances based on the current workload or defined schedule. |
| 11. | k. Developed automated unit tests for their code | To eliminate functional regression and ensure that the application remains in compliance with requirements, we used different levels of automated testing:<br/>- Java unit tests using  [JUnit](http://junit.org/junit4/) - [Jenkins job](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_test_UT/)<br/>- Java integration tests using  [Spring Boot integration testing tools](http://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-testing.html) -  [Jenkins job](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_test_UT/)<br/>- JavaScript unit tests using  [Karma JS](https://karma-runner.github.io/0.13/index.html) - [Jenkins job](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_test_UI/)<br/>- Load testing using  [Gatling](http://gatling.io/#/) -  [Jenkins job](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_test_perf/)<br/>- Acceptance testing using BDD framework  [Cucumber](https://cucumber.io/) -  [Jenkins job](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_test_Cucumber/) |
| 12. | l. Setup or used a continuous integration system to automate the running of tests and continuously deployed their code to their IaaS or PaaS provider. | Continuous integration framework tools: [Jenkins](https://jenkins.io/), [Sonar](http://www.sonarqube.org/). [Configured instance of Jenkins](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/) is available for review. [Instance of Sonar](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:9999/dashboard/index/com.engagepoint.chhs-apqd:chhs-apqd) with history and current project status available for review.High-level description of the Jenkins jobs workflow:<br/>- [Build source code](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_build_no_test/)<br/>- Run series of tests:<br/>  -  [Java unit tests](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_test_UT/)<br/>  - [JavaScript unit tests](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_test_UI/)<br/>  - [Sonar code analyze](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_test_sonar/)<br/>- When all the previous tests pass,  [deploy to Development environment](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_deploy_DEV/) in Amazon Web Service<br/>- Run [acceptance tests](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_test_Cucumber/) based on Cucumber<br/>- Run [load tests](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_test_perf/) based on Gatling<br/>- When all tests pass, [deploy into high availability production environment](http://ec2-54-149-211-42.us-west-2.compute.amazonaws.com:8888/job/chhs-apqd_deploy_from_scratch_PROD/) in Amazon Web Services |
| 13. |  m. Setup or used configuration management | Prototype configuration was implemented based on Spring Boot, giving us the ability to change parameters in different ways such as with Environment variables, command line parameters, and so on. Since we deliver the Application using Docker containers, we use Environment variables as the configuration method.To restrict access to a private information like links to required dependencies, credentials, and so on, we distinguish source code and configuration Git repositories. Deployment jobs check out the necessary configuration files and configure the Prototype for the target environment. |
| 14. |  n. Setup or used continuous monitoring | Continuous monitoring was implemented by the synergy of built-in AWS containers tools for hardware items and Zabbix for application specific parameters.In addition to built-in AWS monitored items like CPU, memory, etc. following Application-specific parameters monitored by Zabbix for every container:<br/>- JVM memory details (Heap, Non-Heap)<br/>- Datasource connection parameters (Active, Idle connections)<br/>- REST services statistic<br/>- Threads statistic (Deadlock, Waiting) |
| 15. | o. Deployed their software in a container (i.e., utilized operating-system-level virtualization) | The Prototype is delivered as Docker container image. It requires PostgreSQL DB and Elasticsearch as external dependencies. The Prototype can be configured to use dependencies as external services or as linked Docker containers. |
| 16. | p. Provided sufficient documentation to install and run their prototype on another machine | To install and run the prototype on another machine, we provide several available options such as a Docker-based deployment and a compilation of the prototype from source code.</br></br><b>Start application using Docker</b></br></br>We have published a Docker image with the application prototype to the Docker Hub. To run the Docker image on another machine, complete the following steps: </br>1. Install [Docker Toolbox](https://www.docker.com/products/docker-toolbox) on your machine</br>2. Start Docker Quickstart Terminal or use graphical tool Kitematic(Alpha)</br>3. Download docker compose file for standlone ( [chhs-apq](https://github.com/engagepoint/chhs-adpq/blob/master/src/main/docker/chhs-apqd-full.yml)d [-full.yml](https://github.com/engagepoint/chhs-adpq/blob/master/src/main/docker/chhs-apqd-full.yml) [)](https://github.com/engagepoint/chhs-adpq/blob/master/src/main/docker/chhs-apqd-full.yml) or high availability ( [chhs-apqd-ha.yml](https://github.com/engagepoint/chhs-adpq/blob/master/src/main/docker/chhs-apqd-ha.yml)) solution.</br>4. Change spring\_mail\_host parameter in yml file to your e-mail server. Without email server, the application will not be able to send account activation emails so user registration will be not functional. In order to test the application capabilities without email server shall use system users.</br>Role Parent: username: parent, password: parent</br>Role Case Worker: username: worker, password: worker</br>Role Administrator: username: admin, password: admin</br>5. In Docker Terminal run the following command line: ```docker-compose f <full-path-to-file>/chhs-apqd-<ha or full>.yml up -d```</br>Please wait 1 to 5 minutes for application start depends on network connection.</br>6. If you have Windows environment, you can open Kitematic (Alpha) and click on Web Preview to open application in the browser. In the Linux, application will be available by default URL [http://127.0.0.1:8080/#/](http://127.0.0.1:8080/#/) (for Full) or [http://127.0.0.1:24080](http://127.0.0.1:24080) (for HA)</br>7. For high availability (HA) configuration (chhs-apqd-ha.yml) you can scale application. For this in Docker terminal run command line: ```docker-compose scale chhs-apqd-ha=n```</br>, where n is desired quantity of Application's containers.</br></br><b>Compile application from source code and start (any operation system)</b></br></br>To compile the application from source code, you will need to setup and configure a development environment using the steps below:</br>1. 1.Install Java Development Kit (JDK) version 8 from  [the Oracle website](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).</br>2. Install Java dependency management tool Maven from official  [Maven website](http://maven.apache.org/)</br>3. Install Git from  [git-scm.com](https://git-scm.com/downloads)</br>4. Clone the project source code from the GitHub repository  [https://github.com/engagepoint/chhs-apqd](https://github.com/engagepoint/chhs-apqd)</br>5. Install Node.js from  [the Node.js website](http://nodejs.org/). This will also install npm, which is the node package manager we are using in the next commands.</br>6. Navigate to the Git repository folder chhs-apqd</br>7. Install Yeoman using the command line: ```npm install -g yo```</br>8. Install Bower using the command line: ```npm install -g bower```</br>9. Install  [Grunt](http://gruntjs.com/) using the command line: ```npm install -g grunt-cli```</br>10. Install JHipster using the command line: ```npm install -g generator-jhipster```</br></br>When the development environment is configured, you can compile and run the prototype application by following the steps below:</br>1. From Git repository folder chhs-apqd, run Maven command: mvn spring-boot:run</br>2. The application will be automatically started on  [http://127.0.0.1:8080/#/](http://127.0.0.1:8080/#/) in 2-10 minutes dependse on performance of your machine |
| 17. |  q. Prototype and underlying platforms used to create and run the prototype are openly licensed and free of charge | EngagePoint has used only open source technologies and platforms for prototype creation. Key technologies with links to source code and license type are described below:<br/>1. Client side:<br/><br/>-  [Bootstrap](http://getbootstrap.com/) 3.3.5: [source code](https://github.com/twbs/bootstrap) [,  ](http://getbootstrap.com/) [MIT License](https://github.com/twbs/bootstrap/blob/master/LICENSE)<br/>-  [UI Bootstrap](http://angular-ui.github.io/bootstrap/) [:](http://getbootstrap.com/) [source code](https://github.com/angular-ui/bootstrap) [,  ](http://getbootstrap.com/) [MIT License](https://github.com/angular-ui/bootstrap/blob/master/LICENSE)<br/>-  [AngularJS](https://angularjs.org/): [source code](https://github.com/angular/angular.js), [MIT License](https://github.com/angular/angular.js/blob/master/LICENSE)<br/>-  [Leaflet](http://leafletjs.com/): [source code](https://github.com/Leaflet/Leaflet), [BSD 2-Clause License](https://github.com/Leaflet/Leaflet/blob/master/LICENSE)<br/>-  [Mapzen](https://mapzen.com/): [source code](https://github.com/mapzen/leaflet-geocoder), [MIT License](https://github.com/mapzen/leaflet-geocoder/blob/master/LICENSE)<br/><br/>2. Server Side:<br/>-  [Spring Boot](http://projects.spring.io/spring-boot/): [source code](https://github.com/spring-projects/spring-boot), [Apache License Version 2](https://github.com/spring-projects/spring-boot/blob/master/LICENSE.txt)<br/>-  [Spring Framework](https://projects.spring.io/spring-framework/): [source code](https://github.com/spring-projects/spring-framework), [Apache License Version 2](https://github.com/spring-projects/spring-framework/blob/183594207fbb447e1b59262b4469f2aefbb8a3ec/src/dist/license.txt)<br/>-  [Spring Security](http://projects.spring.io/spring-security/): [source code](https://github.com/spring-projects/spring-security), [Apache License Version 2](https://github.com/spring-projects/spring-security/blob/master/license.txt)<br/>-  [Spring Data JPA](http://projects.spring.io/spring-data-jpa/): [source code](https://github.com/spring-projects/spring-data-jpa), [Apache License Version 2](http://docs.spring.io/spring-data/jpa/snapshot-site/license.html)<br/>-  [Spring Data Elasticsearch](http://projects.spring.io/spring-data-elasticsearch/): [source code](https://github.com/spring-projects/spring-data-elasticsearch), [Apache License Version 2](https://github.com/spring-projects/spring-data-elasticsearch/blob/master/src/main/resources/license.txt)<br/>-  [Hibernate ORM](http://hibernate.org/orm/) [:](http://hibernate.org/orm/) [source code](https://github.com/hibernate/hibernate-orm) [,](http://hibernate.org/orm/) [LGPL V2.1](http://hibernate.org/license/)<br/>-  [Elasticsearch](https://www.elastic.co/products/elasticsearch): [source code](https://github.com/elastic/elasticsearch), [Apache License Version 2](https://github.com/elastic/elasticsearch/blob/master/LICENSE.txt)<br/>-  [PostgreSQL](https://www.postgresql.org/): [source code](https://github.com/postgres/postgres), [PostgreSQL Licence](https://opensource.org/licenses/postgresql) open license similar to BSD or MIT<br/>-  [Hazelcast](http://hazelcast.org/): [source code](https://github.com/hazelcast/hazelcast), [Apache License Version 2](https://github.com/elastic/elasticsearch/blob/master/LICENSE.txt) [     ](https://github.com/spring-projects/spring-framework)
 |
