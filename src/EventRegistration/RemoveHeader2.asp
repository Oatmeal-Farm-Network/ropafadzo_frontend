

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<HEAD>
 <title>Remove Header</title>
       <link rel="stylesheet" type="text/css" href="style.css">


<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">
<!--#Include file="globalvariables.asp"--> 

<!--#Include file="Header.asp"--> 

<%


Query =  " UPDATE SiteDesign Set Header = '0'  " 
	Query =  Query & " where CustID = 66;" 

'response.write(Query)	


Conn.Execute(Query) 


Query =  " UPDATE EventSiteDesigntemp Set Header = '0'  " 
	Query =  Query & " where EventID = " & EventID
response.write(Query)
Conn.Execute(Query) 

Query =  " UPDATE EventSiteDesign Set Header = '0'  " 
	Query =  Query & " where EventID = " & EventID
	
	response.write(Query)
Conn.Execute(Query) 

	Conn.Close
	Set Conn = Nothing 
 Response.Redirect("LayoutImages.asp?EventID=" & EventID) %>


 </Body>
</HTML>
