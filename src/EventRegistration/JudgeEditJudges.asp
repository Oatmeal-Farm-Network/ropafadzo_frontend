<%@ Language="VBScript" %> 
	

<html>
<head>
<!--#Include virtual="GlobalVariables.asp"-->
<title>Edit Judges</title>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="Andresen Events">
<link rel="stylesheet" type="text/css" href="Style.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<% JudgeIDNeeded = True %>
<!--#Include file="Header.asp"-->
<!--#Include file="JudgesHeader.asp"-->
<% PageTitleText = "Edit Judges"  %>
<!--#Include file="970Top.asp"-->


<% PageTitleText = "List of Judges"  %>
<!--#Include file="940Top.asp"-->
<table border = "0" cellpadding=0 cellspacing=0 width = "939" align = "center">
<tr><td class = "Body" colspan  "3" height = "1">
		
<% sql = "select * from Judges where  EventID = " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if  rs.eof then %>
		Currently you do not have any Judges listed. To add Judges please select  <a href = "JudgesAddJudge.asp?EventID=<%=EventID%>" class = "Body">Add Judges</a>. 
		
	<% else %>	
		
		Below are a list of the Judges that your have scheduled for your event:
		
		
	<% end if %>
		</td></tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
%>

<%
row = "odd"
rowcount = 1
row = "even"


  sql = "select * from Judges where EventID = " & EventID


'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	<br>
	<table border = "0" cellpadding=0 cellspacing=0 width = "939" align = "center">
	  <tr bgcolor = "#eeeeee">
	  <td class="Body" align = "center" width= "100">
	      
	     </td>
	     <td class="Body" align = "center" width = "150">
	       <b>First Name</b>
	     </td>
	     <td class="Body" align = "center" width = "150">
	       <b>Last Name</b>
	     </td>
 		<td class="Body" align = "center" width = "150">
	       <b>EMail</b>
	     </td>
	     <td class="Body" align = "center" width = "150">
	       <b>Phone Number</b>
	     </td>

	     <td class="Body" align = "center">
	       <b>Actions</b>
	     </td>

	   </tr>
	
	<% end if
	order = "odd"
	While Not rs.eof  
	
	JudgeFirstName = rs("JudgeFirstName")
	JudgeLastName = rs("JudgeLastName")
	Judgefax = rs("Judgefax")
	JudgeID = rs("JudgeID")
	Judgeemail = rs("Judgeemail")
	JudgeCell = rs("JudgeCell")
	JudgePhone = rs("JudgePhone")
	JudgeCell = rs("JudgeCell")
	JudgeStreet = rs("JudgeStreet")
	JudgeApt = rs("JudgeApt")
	JudgeCity = rs("JudgeCity")
	JudgeState = rs("JudgeState")
	JudgeZip = rs("JudgeZip")
	JudgeCountry = rs("JudgeCountry")
	JudgeID = rs("JudgeID")
JudgeCountry = rs("JudgeCountry")
JudgeImage = rs("JudgeImage")
JudgeBio = rs("JudgeBio")

	%>

	<input type = "hidden" name="EventID" value= "<%= EventID %>" >
	<input type = "hidden" name="JudgeID" value= "<%= JudgeID %>" >
	<% if order = "even" then 
	order = "odd"
		%>
	  <tr bgcolor = "#eeeeee">
	<% else 
	   order = "even"%>
		<tr>
	<% end if %>
	  <td class="Body" align = "center" height = "25">
	      <% if len(JudgeImage) > 3 then %>
	      	<img src = "<%=JudgeImage%>" height = "25" >
	      <% end if %>
			
	     </td>
	     <td class="Body">
	       <a href = "JudgesEditJudgesDetails.asp?JudgeID=<%=JudgeID%>&EventID=<%=EventID%>" class="Body"><%=JudgeFirstName%></a>
	     </td>
	     <td class="Body" >
	       <a href = "JudgesEditJudgesDetails.asp?JudgeID=<%=JudgeID%>&EventID=<%=EventID%>" class="Body"><%=JudgeLastName%></a>
	     </td>
 		<td class="Body" >
	      <a href = "JudgesEditJudgesDetails.asp?JudgeID=<%=JudgeID%>&EventID=<%=EventID%>" class="Body"><%=Judgeemail%></a>
	     </td>
	     <td class="Body" >
	       <a href = "JudgesEditJudgesDetails.asp?JudgeID=<%=JudgeID%>&EventID=<%=EventID%>" class="Body"><%=JudgePhone%></a>
	     </td>
     	<td class="Body" align = "center">
	      <a href = "JudgesEditJudgesDetails.asp?JudgeID=<%=JudgeID%>&EventID=<%=EventID%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Judge"></a>  
	      <a href = "editsJudgehandle.asp?Delete=True&JudgeID=<%=JudgeID%>&JudgeID=<%=JudgeID%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Judge"></a>

	     </td>

	   </tr>
	<tr><td class = "Body" colspan = "6"  height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>
<br>
<table width = "900" align = "center">
   <tr><td class="Body" align = "center"><b><i>Note: To add a Judge please select <a href = "JudgeAdd.asp?EventID=<%=eventID%>" class = "Body">Add Judges</a></i></b>
   </td>
   </tr>
   </table>
	
<!--#Include file="940Bottom.asp"-->	
<!--#Include file="970Bottom.asp"-->
<!--#Include virtual="/Footer.asp"--> 

</Body>
</HTML>