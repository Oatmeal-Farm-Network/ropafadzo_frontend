<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<%@ Language=VBScript %>

<HTML>
<HEAD>
 <title>Edit Pages</title>
       <link rel="stylesheet" type="text/css" href="style.css">
<!--#Include file="AdminEventGlobalVariables.asp"-->
<%
EventID= Request.Querystring("EventID")
Currentpagename = "JudgesAddJudge.asp"

sql3 = "select * from Services, serviceTypeLookup where services.ServiceTypeLookupID = serviceTypeLookup.ServiceTypeLookupID and  EventID = " & session("EventID")

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql3, conn, 3, 3   
while Not rs.eof 

 
	if rs("ServiceType") = "Halter Show" then
       ShowHalterShow = True 
     End If
 
     if rs("ServiceType") = "Fleece Show" then
       ShowFleeceShow = True 
     End If

   

     if rs("ServiceType") = "Spin-off" then
       ShowSpinOff = True
     End If
rs.movenext
wend
%>
</HEAD>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include file="Header.asp"--> 

<% PageTitleText = "Add Judge"  %>
<!--#Include file="JudgesHeader.asp"--> 
<table width = "<%=screenwidth %>" border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr ><td align = "center">



<table border = "0"  cellpadding=0 cellspacing=0 width = "<%=screenwidth%>" align = "right" >
<tr><td  valign = "top" width = "650">
<form  name=form method="post" action="JudgesAddJudgeHandleForm.asp">

<% PageTitleText = "Name & Address"  %>
<br />
<table  border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
<tr>
			<td class = "body2" colspan = "2">
					<b>This person will be a judge for the following:</b> &nbsp;
				</td>
			</tr>
			<tr>
			<td class = "body2" align = "right" WIDTH = "150">
					 &nbsp;
				</td>
				<td class = "body2" align = "left" WIDTH = "300">
				   <% if ShowHalterShow = True then %>
				     <input type="checkbox" name="JudgeShow" value="HalterJudge" > Halter Show Judge<br >

				   <% end if %>
				   
				     <% if  ShowFleeceShow = True  then %>
				     	<input type="checkbox" name="JudgeShow" value="FleeceJudge" > Fleece Show Judge<br >
				   <% end if %>

  					<% if ShowSpinOff = True then %>
				     	<input type="checkbox" name="JudgeShow" value="SpinOffJudge" > Spin-Off Judge<br>
				   <% end if %>

				</td>
			</tr>
<tr>
				<td class = "body2" align = "right" WIDTH = "150">
					First Name:* &nbsp;
				</td>
				<td class = "body2" align = "left" WIDTH = "300">
					<input name="JudgeFirstName" Value ="<%=JudgeFirstName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			<tr>
				<td class = "body2" align = "right">
					Last Name:* &nbsp;
				</td>
				<td class = "body2">
					<input name="JudgeLastName" Value ="<%=JudgeLastName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			
<tr>
	<td class = "body2" align = "right">
			Website: &nbsp;
		</td>
		<td class = "body2">
			http://<input name="JudgeWebsite" Value ="<%=JudgeWebsite%>"  size = "30" maxlength = "61">
		</td>
	</tr>
	<tr>
			<td   class = "body2" align = "right">
				Phone: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="JudgePhone"  size = "30" value = "<%=JudgePhone%>">
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				Cell: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="JudgeCell"  size = "30" value = "<%=JudgeCell%>">
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				Fax: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="JudgeFax"  size = "30" value = "<%=JudgeFax%>">
			</td>
		</tr>
		<tr>
		<td colspan = "2" class = "body">
		 <%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1");
		</script>
 		  Judges Biography
 		   <textarea name="JudgeBio" cols="60" rows="6" wrap="VIRTUAL" id = "textarea1"><%=PeopleBio%></textarea>
		</td>
		</tr>
		<tr><td  align = "center" colspan = "2">
        <input name="CurrentJudgeID" type = "hidden"  value = "<%=CurrentJudgeID%>">
         <input name="EventID" type = "hidden"  value = "<%=EventID%>">
		<center><input type=submit value="Add Judge" class = "regsubmit2" ></center>
</td></tr>
</table>						
			</form>			

</td>
<td width = "5"><img src= "images/px.gif" height = "1" width = "1" /></td>
<td valign = "top" class = "body"><img src= "images/px.gif" height = "19" width = "442" />
&nbsp;
</td>
</tr>
</table>

 </td></tr></table>

 
 
<!--#Include file="Footer.asp"--> </Body>
</HTML>