<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Edit Groups Page</title>
       <link rel="stylesheet" type="text/css" href="/administration/style.css">
</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "white" >

<!--#Include virtual="/Administration/Header.asp"--> 
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "799">
	<tr>
		<td Class = "body">
			<H2>Group Names<br>
			<img src = "images/underline.jpg"></H2>
			Sometimes it's handy to group animals together (I.e. Pregnant Females,  Dieting Females, etc). You can add/edit/delete group names and assign them to animals below.
			<br><br>
		</td>
	</tr>
</table>


<table>
	<tr>
		<td valign = "top">
			 <form action= 'AddGroup.asp' method = "post">
<table border = "1" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
 <tr>
		<td align = "center">
					<H2>Add a Group Name</H2>
		</td>
	</tr>
  	<tr>
			<td  align = "center">
					<input name="GroupName"  size = "15">
				</td>
		</tr>
		<tr>
		<td  valign = "middle">
			<div align = "center">
			<Input type = Hidden name='TotalCount' value = <%=TotalCount%> >
			<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" Class = "menu" >
			
		</td>
		</tr>
		</table></form>
		</td>
		<td width = "10">
			&nbsp;
		</td>
		<td valign = "top">
		<form action= 'EditGroups.asp' method = "post">

		<table border = "1" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
		<tr>
			<td align = "center">
					<H2>Edit Group Names</H2>
			</td>
		</tr>	
		
<% 
	dim aID(40000)
	dim aName(40000)
	dim GroupName(40000)
	dim GroupID(40000)
	rowcount = 1

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
 sql = "select * from Groups order by GroupName"

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	
if  rs.eof then
	GroupID(1)=   0
end if

	While  Not rs.eof       
	 
	 GroupID(rowcount) =   rs("GroupID")
	 GroupName(rowcount) =   rs("GroupName")
	%>

	
	<tr >
		<td>
			<input type = "hidden" name="GroupID(<%=rowcount%>)" value= "<%=  GroupID( rowcount)%>" >
			<input name="GroupName(<%=rowcount%>)" value= "<%=GroupName(rowcount)%>" >
		</td>
	</tr>

<%
		rowcount = rowcount + 1
	   rs.movenext
	Wend
TotalCount=rowcount 
	
%>
<tr>
		<td  valign = "middle">
			<div align = "center">
			<Input type = Hidden name='TotalCount' value = <%=TotalCount%> >
			<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" Class = "menu" >
			
		</td>
		</tr>
</table></form>
		</td>
		<td width = "10">
			&nbsp;
		</td>
		<td valign = "top" >
		<table border = "1" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
			<tr>
				<td valign = "top" >
					<H2>Delete a Group</H2>
				</td>
			</tr>
			<tr>
				<td>
				<form action= 'DeleteGroup.asp' method = "post">
		  			<select size="1" name="GroupID" size = "20">
					<option name = "GroupID0" value= "" selected></option>
					<% count = 1
						while count < TotalCount
					%>
						<option name = "GroupID1" value="<%=GroupID(count)%>" >
							<%=GroupName(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
				</td>
			</tr>
			<tr>
				<td align = "center">
					<input type=submit value = "Delete" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
				</td>
			  </tr>
		    </table>
		  </form>

		</td>
	</tr>
</table>



<table border = "1" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "400">
			<tr>
				<td valign = "top" colspan = "2">
					<H2><div align = "center"> Assign Animals to Groups</H2>
				</td>
			</tr>
<%

 sql = "select * from Animals order by Animals.FullName"

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	rowcount = 1
	dim ID(40000) 
	dim	Name(40000) 



Recordcount = rs.RecordCount +1
%>

	<tr>
		<th >Name</th>

		<th >Group </th>
	</tr>
	
<%
 While  Not rs.eof      

	ID(rowcount) =   rs("ID")
	 Name(rowcount) =   rs("FullName")
	 GroupID(rowcount)=   rs("GroupID")
%>

	<form action= 'GroupAssign.asp' method = "post">
	<tr >
		<td >
			<input type = "hidden" name="ID(<%=rowcount%>)" value= "<%=  ID( rowcount)%>">
		    <input name="Name(<%=rowcount%>)" value= "<%= Name( rowcount)%>" size = "30"></td>
		</td>
		<td>
		<% 	rowcount2 = 1

			if GroupID(1) = 0 or len(GroupID(1)) <1  then
				tempGroupName = "none"
				tempGroupID =0
			else
				sql2 = "select * from Groups where GroupID = " & rs("GroupID")
				Set rs2 = Server.CreateObject("ADODB.Recordset")
				rs2.Open sql2, conn, 3, 3   
					if not rs2.eof then
						tempGroupName = rs2("GroupName")
						tempGroupID =rs("GroupID")
					end if
			end if

			sql2 = "select * from Groups order by GroupName"
			Set rs2 = Server.CreateObject("ADODB.Recordset")
			rs2.Open sql2, conn, 3, 3   
	
			While  Not rs2.eof         
				GroupID(rowcount2) =   rs2("GroupID")
				GroupName(rowcount2) =   rs2("GroupName")
				rowcount2 = rowcount2 + 1
				rs2.movenext
			Wend
			TotalCount2=rowcount2 
			%>

				<select size="1" name="GroupID(<%=rowcount%>)" size = "20">
					<option name = "GroupID0" value= "<%=tempGroupID%>" selected><%=tempGroupName%></option>
					<option name = "GroupID1" value="0">none</option>
					<% count = 1
						while count < TotalCount2
					%>
						<option name = "GroupID2" value="<%=GroupID(count)%>" >
							<%=GroupName(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
			</td>
		</tr>
<%
		rowcount = rowcount + 1
	   rs.movenext
	Wend
TotalCount=rowcount 
	rs.close
  set rs=nothing
  set conn = nothing
%>

<tr>
		<td colspan = "2" align = "center" valign = "middle">
			<br>
			<Input type = Hidden name='TotalCount' value = <%=TotalCount%> >
			<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
			</form>
		</td>
</tr>
</table>





<!--#Include virtual="/Administration/Footer.asp"--> </Body>
</HTML>