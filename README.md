# Urban-Waste-Management-System 
This projects creates a web-based dashboard view for managers of an automated waste-collection system.  
It employs the MVC model:
* The Model is logics implemented in a MySQL database with functional features including authentication and data calibration.
* The Controller acts as intermediary between the database and the front-end. It allows communication via an API. It's also where the route-allocation task is handled. We employ Travelling Salesman Heuristics for the job. From BE, we employ OSRM to store Vietnam's geolocation and to produce accurate computation related to route- and workload-allocation.
* The View is where the dashboard is implemented. It includes map management, schedule management and employee management modules. The FE is implemented using ReactJS. 
---
Documents annotate two things:
* First is the system structure, including the design process, use-cases, requirements specification and architecture sketching.
* Second is the database, including design and implementation.
