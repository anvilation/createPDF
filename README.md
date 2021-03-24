# createPDF

Have you ever been stuck on a project needing a PDF render and didnt want to mess around with trail software? This is a little node.js utility to Create PDF documents based upon various files times (DOC, PPT, XLS, HTML). 

This uses the functionality within Libre Office https://www.libreoffice.org/

## How do I get set up? ##
Before you start you will need to install:

* Install node
* Install Libre Office (https://www.libreoffice.org/)
 
Once installed you will need to clone this repo

* ```git clone https://github.com/anvilation/createPDF.git```
* browse to the newly created folder and run ``` npm install ```
* EXTRA SUGAR - Once tested you can then install as a service using NSSM (https://nssm.cc/). To do this run the following command ```  .\nssm.exe install createPDF <location of node>\node.exe <location of CreatePDF>\index.js ```
 
## Configuration ##
The current version only uses a configuration.js file to list out the locations of the following:

* libre - location of Libre Office Install
* input - location where documents wlil be placed
* output - locaiton where documents will be rendered to
* debug - debug level (not configured in current version)
* log - log location (not configured in current version)
