<%@ Language="VBScript" %> 
<html>
<head>

<%  PageName = "Event Judges" %>
<!--#Include virtual="GlobalVariablesEvent.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<title><%= EventName %> at Andresen Events - Event Registration</title>
<meta name="Title" content="<%= EventName %> at Andresen Events - Event Registration">
<meta name="description" content="<%= EventDescription %> " >
<meta name="keywords" content="Event Registration">
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Alpacas Shows" >
<link rel="shortcut icon" href="file:///infinityknot.ico" > 
<link rel="icon" href="http://www.alpacainfinity.com/alpacachamps/infinityknot.ico" > 
<meta name="author" content="The Andresen Goup" >
<link rel="stylesheet" type="text/css" href="Style.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<!--#Include file="EventHeader.asp"-->

<table border = "0"  cellpadding=0 cellspacing=0 width = "<%=textwidth %>" align = "center" >
	<tr>
	   <td  valign = "top"   colspan = "3"><br><h2>Judges</h2></td>
	</tr>
	<tr>
		<td class = "body" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td>
	</tr>
	<tr>
		<td class = "body" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td>
	</tr>
</table>

<table border = "0"  cellpadding=0 cellspacing=0 width = "<%=textwidth %>"  align = "center">

	<tr><td>

<%
sql = "select * from People, Judges, Judgesshows where Judges.PeopleID = People.peopleID and Judges.JudgeID = Judgesshows.JudgeID and  People.Judge = True and Judges.EventID = " & EventID & " order by ShowType DESC "
'response.write("sql = " & sql & "<br>")
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3 
  
While Not rs.eof 
	EventID = rs("EventID") 
	peopleID = rs("peopleID")
	Judge = rs("Judge")
	ShowType = rs("ShowType")
	PeopleFirstName = rs("PeopleFirstName")
	PeopleLastName = rs("PeopleLastName")
	PeopleImage1 = rs("PeopleImage1")
	JudgeBio = rs("JudgeBio")
	
%>

	<table border = "0"    cellpadding=0 cellspacing=0 width = "<%=textwidth %>" align = "Center" >	
	<% If ShowType = "Halter" then%>
		<tr>	
			<td class = "body"  align="Left" width="<%=textwidth - 210 %>" valign="top">
				<b>  Halter Show Judge: <%=PeopleFirstName%>&nbsp;<%=PeopleLastName%></b><br>
				<blockquote><%=JudgeBio%></blockquote>
			</td>
			<td class="Menu2" align = "center" width = "210" valign="top" >
		    	<% if len(PeopleImage1) > 3 then %>
		      		<img src = "<%=PeopleImage1%>" width = "200" class="special">
		     	<% end if %>
			</td>
		</tr>
		<br>
	<% end if %>
	</table>
	
	<table border = "0" cellpadding=0 cellspacing=0 width = "<%=textwidth %>" align = "Center" >
	<% If ShowType = "Fleece" then%>
		<tr>	
			<td class = "body"  align="Left" width="<%=textwidth - 210 %>" valign="top">
				<b>  Fleece Show Judge: <%=PeopleFirstName%>&nbsp;<%=PeopleLastName%></b><br>
				<blockquote><%=JudgeBio%></blockquote>
			</td>
			<td class="Menu2" align = "center" width = "210" valign="top" >
		    	<% if len(PeopleImage1) > 3 then %>
		      		<img src = "<%=PeopleImage1%>" width = "200" class="special" >
		     	<% end if %>
			</td>
		</tr>
	<% end if %>
	<br>
	</table>
	
	<table border = "0"  cellpadding=0 cellspacing=0 width = "<%=textwidth %>" align = "center" >
	<% if ShowType = "SpinOff" then%>
		<tr>	
			<td class = "body"  align="Left" width="<%=textwidth - 210 %>" valign="top">
				<b>  Spin-Off Judge: <%=PeopleFirstName%>&nbsp;<%=PeopleLastName%></b><br>
				<blockquote><%=JudgeBio%></blockquote>
			</td>
			<td class="Menu2" align = "center" width = "210" valign="top" >
		    	<% if len(PeopleImage1) > 3 then %>
		      		<img src = "<%=PeopleImage1%>" width = "200" class="special">
		     	<% end if %>
			</td>
		</tr>
	<% end if %>
	<br>
	</table>
<% 
	rs.movenext
Wend		
%>
	    
</td></tr>     	
</table>
<br><br>
<table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "<%=bodywidth -50 %>" align = "center" >
<tr>
<td class= "body" valign = "top" colspan = "2" > 
<%= Description%></td>
	</tr>
</table>

<br><br>
 <!--#Include file="EventFooter.asp"--> 
  <!--#Include file="Footer.asp"--> 
</body>
</html>

