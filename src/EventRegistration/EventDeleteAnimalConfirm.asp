<%@ Language="VBScript" %> 
<html>
<head>

<%  PageName = "Delete Animal" 
PageLink = "EventDeleteAnimal.asp" %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<title><%= EventName %> at Andresen Events - Event Registration</title>
<meta name="Title" content="<%= EventName %> at Andresen Events - Event Registration">
<meta name="description" content="<%= EventDescription %> " >
<META name="keywords" content="Alpaca events, livestock events, events,Alpaca event registration, Livestock event registration, online registration, event registration, online event registration, event registration software, event registration online, online event registration software, event registration management software, event registration system, event management, registration software, event registration service, event registration services, easy online event registration, online event registration service, event registration website, event registration site, online event registration services,  PayPal, credit cards, online payments"> 
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Alpaca Events" >
<link rel="shortcut icon" href="/AELogo.ico" > 
<link rel="icon" href="http://www.AndresenEvents.com/AELogo.ico" > 
<meta name="author" content="The Andresen group">
<link rel="stylesheet" type="text/css" href="Style.css">

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<!--#Include file="EventHeader.asp"-->


<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
<tr><td class = "body" colspan = "2" ><br><h1>Delete an Animal</h1>
</td>
</tr>
  <tr><td class = "body"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
</table>

<% 
AnimalID = Request.Form("AnimalID")
'response.write("DeleteEvent AnimalID = " & AnimalID & "<br/>")

	sql2 = "select * from Animal where PeopleID = " & PeopleID & " and AnimalID = " & AnimalID & " order by AnimalsName"
	'response.Write("sql2=" & sql2 )
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	if Not rs2.eof  then
		AnimalID = rs2("AnimalID")
		AnimalsName = rs2("AnimalsName")
		AnimalRegistrationID = rs2("AnimalRegistrationID")
		DamID=rs2("DamID")
		SireID=rs2("SireID")
	end if		


sql2 = "select * from RegisteredAnimals where  AnimalID = " & AnimalID 
	'response.Write("sql2=" & sql2 )
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	if Not rs2.eof  then
		HalterClassID= rs2("HalterClassID")
		ProductionClassID= rs2("ProductionClassID")
	end if		
	
%>
<br /><br />
<table width = "400" border="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 align ="center">
<tr>
		<td class = "body2" align = "right">
			<b>Animal's Name:</b>&nbsp;
		</td>
		<td class = "body2">
			<b><%=AnimalsName%></b>
		</td>
</tr>
</table>
<table width = "<%=Textwidth%>" border="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 align ="center"> 
<tr>
  <td colspan ="2" align ="center"><br />
  <H3>Warning! Once your animal is deleted, it is gone forever!</h3>
   </td>
</tr>	
</table>

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "200" align = "center">
<tr>
<td>
<form  name=form method="post" action="EventDeleteAnimal.asp?EventID=<%=EventID%>&PeopleID=<%=PeopleID%>">
      <input type="Submit" value="Cancel" class = "regsubmit2">
</form>

</td>
<td align = "left">
<form  name=form method="post" action="EventDeleteAnimalhandleform.asp?AnimalID=<%=AnimalID%>&AnimalRegistrationID=<%=AnimalRegistrationID%>&HalterClassID=<%=HalterClassID%>&ProductionClassID=<%=ProductionClassID%>&SireID=<%=SireID%>&DamID=<%=DamID%>">
               
		<input type="Submit" value="Delete" class = "regsubmit2">

	</form>


</td>
</tr>
</table>



<!--#Include file="Footer.asp"--> </Body>
</HTML>