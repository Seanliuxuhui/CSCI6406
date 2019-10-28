This file contains the instructions of how to set up the project and run the application.

Please note: it is expected you have internet access, as some of the content are not available locally.

The first section list the environment setup procedures.

    This project can be cloned from https://git.cs.dal.ca/xuhui/csci-6404-final-project.git

    You can clone this project to your local environment by typing "git clone https://git.cs.dal.ca/xuhui/csci-6404-final-project.git"

    folder /
            - src /
                  - data /
                         - sankeyDiagram /
                            - index.js
                            - links.json
                            - nodes.json
                         - scatterPlot /
                            - index.js
                            - points.json
                            - pointsDetails.json
                         - streamDiagram /
                            - index.js
                            - streamdiagramFreq.json
                         - wordcloudSubtopics/
                            - a list of files containing features words of subtopics
                         - wordcloudTopics/
                            - a list of files containing features words of topics
                  - views /
                          - css /
                                - bootstrap.css
                                - bootstrap-theme.css
                                - style.css
                          - js /
                                - d3
                                - dom.js
                                - main.js
                                - jquery-1.7.2.js
                                - sankeyDiagram.js
                                - scatterplot.js
                                - streamDiagram.js
                                - tagCanvas.js
                          - index.html
                  - server.js
            - package.json
            - readme.json

            The whole application takes in the processed data generated from Project.ipynb and KDD2013 and populates the plots.

    In order to run the application, you should make sure you have node and npm installed before.
    1. run 'npm install' to install necessary packages
    2. run 'npm run start' to start the application
    3. open up your chrome browser and go to 'http://localhost:3000/'

Code comments are available in each file.

Please note: The workflow of this project is described in the accompanying paper. The main procedures are
1. Use project.ipynb to preprocess the data and train the KDD2013 model with processed data (Tokens and PT for journals for each year)
2. Use project.ipynb to further process the results generated from KDD2013
3. Use final processed data from project.ipynb for visualization

